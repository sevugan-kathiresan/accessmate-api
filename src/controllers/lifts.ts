import { Request, Response } from "express";
import { QueryParams } from "../types";
import pool from "../db/connectionPool";
import { PoolClient } from "pg";
import { getLiftsQuery, getNearestLiftsQuery } from "../db/liftsQuery";


export const getLifts = async (req: Request, res: Response) => {
    const { suburb, latitude, longitude, radius } = req.query as QueryParams; // Get the query params
    let query: string;
    let client: PoolClient | null = null;
    let getProximal: boolean = false;
    let values: number[] = [];

    if (latitude && longitude && radius){
        getProximal = true;
        query = getNearestLiftsQuery();
        values.push(parseFloat(latitude), parseFloat(longitude), parseFloat(radius));
    } else {
        query = getLiftsQuery(suburb);
    }

    try {
        client = await pool.connect();
        const result = getProximal ? await client.query(query, values) : await client.query(query);

        if (result.rows.length > 0){
            res.status(200).json({
                success: true,
                data: result.rows,
                message: "Lifts data successfully retrieved"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Lifts data not found"
            })
        }
    } catch (error) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown error occurred while retrieving the lifts data";
        console.log(errorMessage);
        res.status(500).json({
            success: false,
            message: "Error retrieving the lifts data"
        });
    } finally {
        if (client){
            client.release();
        }
    }
}