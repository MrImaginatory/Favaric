import type { ModelStatic } from "@sequelize/core";
import { Model } from "@sequelize/core";


export const createRecord = async <T extends Model>(
    model: ModelStatic<T>,
    data: any
): Promise<T> => {
    return await model.create(data);
};

export const getAllRecords = async <T extends Model>(
    model: ModelStatic<T>,
    queryOptions: any = {}
): Promise<T[]> => {
    return await model.findAll(queryOptions);
};

export const getRecord = async <T extends Model>(
    model: ModelStatic<T>,
    queryOptions: any = {}
): Promise<T | null> => {
    return await model.findOne(queryOptions);
};

export const updateRecord = async <T extends Model>(
    model: ModelStatic<T>,
    data: any,
    queryOptions: any
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
    return await model.destroy({
        where: { [primaryKeyField]: id } as any
    });
};
