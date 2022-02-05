import 'dotenv/config'
import { Sequelize } from 'sequelize';
import fs from 'fs';


const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
        host: process.env.PGHOST,
        dialect: 'postgres'
    });

for (const fileName of fs.readdirSync('./db/models')) {
    let model = (await import('./models/' + fileName)).default;
    if (model.init) {
        model.init(sequelize);
    } else {
        model(sequelize, Sequelize);
    }
}

sequelize.sync();

export default sequelize;