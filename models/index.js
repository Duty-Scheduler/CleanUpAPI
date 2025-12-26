import sequelize from '../lib/db.js';

(async () => {
    try {
        await sequelize.sync({ alter: false });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Unable to synchronize the models with the database:', error);
    }
})();

export {
    sequelize
};