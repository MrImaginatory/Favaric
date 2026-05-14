import fs from 'fs';
import path from 'path';
import sequelize from '../database/database.js';

const basename = path.basename(__filename);

const intializeModels = async () => {
    const models: any = {};

    const getAllFiles = (dir: string, fileList: string[] = []) => {
        const files = fs.readdirSync(dir);

        files.forEach((file => {
            const filepath = path.join(dir, file);

            if (fs.statSync(filepath).isDirectory()) {
                getAllFiles(filepath, fileList);
            } else {
                if (
                    (file.indexOf('.') !== 0) &&
                    ((file.endsWith('.model.ts') || file.endsWith('.model.js'))) &&
                    (file !== basename) &&
                    (file !== 'index.ts' && file !== 'index.js')
                ) {
                    fileList.push(filepath);
                }
            }
        }))
        return fileList;
    }

    const modelFiles = getAllFiles(__dirname);

    for (const modelPath of modelFiles) {
        const modelModule = await import(modelPath);
        const model = modelModule.default || Object.values(modelModule)[0];

        if (model && model.name) {
            models[model.name] = model;
        }
    }

    Object.values(models).forEach((model: any) => {
        if (model.associate) {
            model.associate(models);
        }
    })

    return models;
}

export { sequelize };
export default intializeModels;