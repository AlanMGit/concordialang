import { Database } from '../ast/Database';
import { DatabaseInterface } from '../req/DatabaseInterface';
import { RuntimeException } from '../req/RuntimeException';
import { DatabaseWrapper } from './DatabaseWrapper';
import { LocatedException } from '../req/LocatedException';
import { Spec } from '../ast/Spec';
import { ConnectionCheckResult, ConnectionResult } from '../req/ConnectionResult';

/**
 * Checks all the connections of a specification.
 *
 * @author Thiago Delgado Pinto
 */
export class DatabaseConnectionChecker {

    async check(
        spec: Spec,
        errors: LocatedException[],
        disconnectAfterConnecting: boolean = false
    ): Promise< ConnectionCheckResult > {

        let r: ConnectionCheckResult = new ConnectionCheckResult( true );

        for ( let doc of spec.docs ) {

            // Sanity checking
            if ( ! doc.databases ) {
                continue;
            }

            for ( let db of doc.databases ) {

                let dbi: DatabaseInterface = this.createDBI( db );

                let cr: ConnectionResult = {
                    success: true,
                    errors: [],
                    databaseName: db.name,
                    dbi: dbi
                } as ConnectionResult;

                ( db as Database ).connectionResult = cr;
                r.resultsMap[ db.name ] = cr;

                // connect
                try {
                    await dbi.connect( db, spec.basePath );
                } catch ( err ) {

                    r.success = false;
                    cr.success = false;
                    const msg = 'Could not connect to the database "' + db.name + '". Reason: ' + err.message;

                    let e = new RuntimeException( msg, db.location );
                    cr.errors.push( e );
                    errors.push( e );
                    doc.fileWarnings.push( e );

                    continue;
                }

                if ( ! disconnectAfterConnecting ) {
                    continue;
                }

                // disconnect
                try {
                    if ( await dbi.isConnected() ) {
                        await dbi.disconnect();
                    }
                } catch ( err ) {
                    const msg = 'Error while disconnecting from database "' +
                        db.name + '". Details: ' + err.message + ' at ' + err.stack;

                    let e = new RuntimeException( msg, db.location );
                    cr.errors.push( e );
                    errors.push( e );
                    doc.fileWarnings.push( e );
                }
            }
        }
        return r;
    }


    createDBI = ( db: Database ): DatabaseInterface => {
        // In the future, other implementation could be selected, according to the database type
        return new DatabaseWrapper();
    };

}