import type { ModelStatic, CreationAttributes, Attributes, FindOptions, UpdateOptions } from "@sequelize/core";
import { Model } from "@sequelize/core";
import sequelize from "../database/database.js";
import AppError from "../utils/appError.util.js";


export const createRecord = async <T extends Model>(
    model: ModelStatic<T>,
    data: CreationAttributes<T>
): Promise<T> => {
    return await model.create(data);
};

export const getAllRecords = async <T extends Model>(
    model: ModelStatic<T>,
    queryOptions: FindOptions<Attributes<T>> = {}
): Promise<T[]> => {
    return await model.findAll(queryOptions);
};

export const getRecord = async <T extends Model>(
    model: ModelStatic<T>,
    queryOptions: FindOptions<Attributes<T>> = {}
): Promise<T | null> => {
    return await model.findOne(queryOptions);
};

export const updateRecord = async <T extends Model>(
    model: ModelStatic<T>,
    data: Partial<T> | any, // Can use UpdateOptions later if needed
    queryOptions: UpdateOptions<Attributes<T>>
): Promise<any> => {
    // Remove any undefined properties so we only update the provided fields
    const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    return await model.update(cleanData as any, queryOptions);
};

export const deleteRecord = async <T extends Model>(
    model: ModelStatic<T>,
    primaryKeyField: string,
    id: string
): Promise<number> => {
    const models = sequelize.models;
    const modelNames = models.getNames();

    for (const modelName of modelNames) {
        const referencingModel = models.get(modelName) as any;
        const associations = referencingModel.associations;
        
        for (const assocName in associations) {
            const assoc = associations[assocName];
            
            if (assoc.associationType === 'BelongsTo' && assoc.target === model) {
                const foreignKey = assoc.foreignKey;
                
                const referencingRecord = await referencingModel.findOne({
                    where: { [foreignKey]: id, deletedAt: null } as any
                });
                
                if (referencingRecord) {
                    throw new AppError(`Cannot delete ${model.name}. It is currently referenced by ${referencingModel.name}.`, 409);
                }
            }
        }
    }

    return await model.destroy({
        where: { [primaryKeyField]: id } as any
    });
};

export const checkRecordExists = async <T extends Model>(
    model: ModelStatic<T>,
    queryOptions: any = {}
): Promise<boolean> => {
    const record = await model.findOne(queryOptions);
    return record !== null;
};
