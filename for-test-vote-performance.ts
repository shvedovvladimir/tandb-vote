import * as got from 'got';
/*
check deadlock when run, should not be lock with static pid and resp with err
should not duplicate vote_item name

select pid,
       usename,
       pg_blocking_pids(pid) as blocked_by,
       query as blocked_query
	from pg_stat_activity
    where cardinality(pg_blocking_pids(pid)) > 0;
*/
export class TandbAuthProxyService {
    public async test(): Promise<any> {
        for (let n = 0; n < 35; n++) {
            console.log('############################################################_____', n);
            const promises = [];
            for (let i = 0; i < 60; i++) {
                const steps = this.randomInt(10, 20);
                for (let j = 0; j < steps; j++) {
                    const acc = this.randomInt(1, 2);
                    const postfix = this.randomInt(1, 5000);
                    promises.push(this.ebash(postfix, acc));
                }
            }
            console.log('PROMISES COUNT', promises.length);
            await Promise.all(promises);
        }
    }

    private async ebash(counter: number, acc: number): Promise<void> {
        const url = 'http://localhost:9082/api/vote';
        const method = 'POST';

        let response;

        try {
            response = await got(url, { method, json: true, body: {
                voteFor: `string${counter}`,
                accessKeyId: acc,
              },
              timeout: 100000, retry: 3,
            });
        } catch (err) {
            console.log('ERROR', err.code || err.message);
        }
    }

    private randomInt(min: number, max: number): number {
        return min + Math.floor((max - min) * Math.random());
    }
}

const test = new TandbAuthProxyService();
test.test().then(() => { console.log('DONE!')});
