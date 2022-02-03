import { Sequelize } from 'sequelize';
import fs from 'fs';

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    dialect: 'postgres'
});

fs.readdirSync('./sequelize/models').map(fileName => {
    import('./models/' + fileName).then(model => {
        model = model.default;
        if (model.init) {
            model.init(sequelize);
        } else {
            model(sequelize, Sequelize);
        }
    })
});

export default sequelize;