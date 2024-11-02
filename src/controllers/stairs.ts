import { Request, Response } from "express";
import { QueryParams } from "../types";
import { PoolClient, QueryResult } from "pg";
import pool from "../db/connectionPool";
import { getStairsQuery, getNearestStairsQuery } from "../db/stairsQuery";

export const getStairs = async (req: Request, res: Response) => {
    const { suburb, latitude, longitude, radius } = req.query as QueryParams;
    let query: string;
    let values: number[] = [];
    let getProximal: boolean = false;
    let client: PoolClient | null = null;

    if (latitude && longitude && radius){
        values.push(parseFloat(latitude), parseFloat(longitude), parseFloat(radius));
        query = getNearestStairsQuery();
        getProximal = true;
    } else {
        query = getStairsQuery(suburb);
    }

    try {
        client = await pool.connect();
        const result: QueryResult = getProximal ? await client.query(query, values) : await client.query(query);

        if (result.rows.length > 0){
            res.status(200).json({
                success: true,
                data: result.rows,
                message: 'Successfully stairs data retrieved'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Satirs data not found'
            });
        }
    } catch (error) {
        const errorMessage: string = error instanceof Error ? error.message : 'Unknown error occurred';
        console.log(errorMessage);

        res.status(500).json({
            success: false,
            message: 'Error retrieving the stairs data'
        });
    } finally {
        if (client) {
            client.release();
        }
    }
};