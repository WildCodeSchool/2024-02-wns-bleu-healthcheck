import {Resolver} from 'type-graphql';
import {SavedQuery} from "../entity/SavedQuery";
import {RequestTester} from "../helpers/RequestTester";
import {Log} from "../entity/Log";
import {MailJet} from "../helpers/MailJet";

@Resolver()
class LogResolver {
    /**
     * Function called by the QueryResolver to test an url and store the result in the database
     */
    static logUrlTest = async (query: SavedQuery) => {

        const testResult = await RequestTester.testRequest(query.url);
        const testDate = new Date();

        const log = Log.create({
            query: query,
            date: testDate,
            status: testResult.testStatus.status,
            response_time: testResult.testStatus.response_time,
            status_code: testResult.testStatus.status_code,
            status_message: testResult.testStatus.status_message,
        });

        await Log.save(log);

        // If the status_code doesn't start with 2, increment the number of errors since the last mail sent (premium users only)
        if(!log.status_code.toString().startsWith('2') && query.errorsBeforeSendingMail !== 0 && query.user!.role >= 1) {
            query.errorsSinceLastMail++;
        }

        // If the status_code doesn't start with 2, the user is premium, and the query has reached requested number of errors, send an email using MailJet
        const mailShouldBeSent = !log.status_code.toString().startsWith('2') &&
            query.user!.role >= 1 &&
            query.errorsBeforeSendingMail !==0 &&
            query.errorsBeforeSendingMail <= query.errorsSinceLastMail

        if (mailShouldBeSent) {
            // Get pretty date from testDate in format DD/MM/YYYY
            const prettyDate = testDate.toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit', year: 'numeric'});

            // Get pretty time from testDate in format HH:MM:SS for french timezone
            const prettyTime = testDate.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Paris'});

            try {
                const mailjetClient = MailJet.getInstance();

                await mailjetClient.sendMail(
                    query.user!.email, // User Email
                    query.user!.name, // User Name
                    `[${query.name}] Failure detected`, // Email Subject
                    `
                    <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; border-radius: 8px; padding: 8px; background: radial-gradient(ellipse at 50% 50%, #c1e0f7 0%, #fafafa 89%);">
                        <h1 style="color: #6cf069;">URaLive</h1>
                        <h2 style="color: #ff0000;">La requ&ecirc;te ${query.name} a rencontr&eacute; une erreur le ${prettyDate} &agrave; ${prettyTime}</h2>
                        <p>Code de statut: ${log.status_code}</p>
                        <p>Message: ${log.status_message}</p>
                    </div>
                    ` // HTML content
                );
                console.log('Email sent to:', query.user!.email);

                // Reset the number of errors since the last mail sent
                query.errorsSinceLastMail = 0;

            } catch (err) {
                console.error('Error sending email:', err);
            }
        }

        // Save the query with the updated number of errors since the last mail sent
        await SavedQuery.save(query);
        return;
    }
}

export default LogResolver;
