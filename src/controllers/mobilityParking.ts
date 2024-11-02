import { Request, Response } from "express";
import pool from "../db/connectionPool";
import { PoolClient } from "pg";
import { QueryParams } from "../types";
import { getNearestParkingQuery, getParkingQuery } from "../db/mobilityParkingQuery";


// Function to get all mobilityparking
export const getAllMobilityParking = async (req: Request, res: Response) => {
    
    // Extract the query params
    const { suburb, latitude, longitude, radius } = req.query as QueryParams;
    let query: string;
    let client: PoolClient | null = null;
    let getProximal: boolean = false;
    let values: number[] = [];

    if (latitude && longitude && radius){
        getProximal = true;
        values = [parseFloat(latitude), parseFloat(longitude), parseFloat(radius)];
        query = getNearestParkingQuery();
    } else {
        query = getParkingQuery(suburb);
    }

    try{
        client = await pool.connect();
        const result = getProximal? await client.query(query, values) : await client.query(query)

        if (result.rows.length > 0){
            res.status(200).json({
                success: true,
                data: result.rows,
                message: "Mobility Parking data retrieved successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Mobility Parking data not found"
            });
        }

    } catch (error) {
        const errorMessage: string = error instanceof Error ? error.message: "Unknown error occurred while retrieving mobility parking data";
        console.log("Error retrieving mobility parking data:", errorMessage)
        res.status(500).json({
            success: false,
            message: "Error retrieving the mobility parking data"
        })
    } finally {
        if(client) {
            client.release();
        }
    }
}