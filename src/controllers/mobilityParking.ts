import { Request, Response } from "express";
import pool from "../db/connectionPool";
import { PoolClient } from "pg";
import { QueryParams } from "../types";

// Function to get all mobilityparking
export const getAllMobilityParking = async (req: Request, res: Response) => {
    
    // Extract the query params
    const { suburb } = req.query as QueryParams;
    let whereClause: string = suburb? `WHERE LOWER(l.suburb) = '${suburb.toLowerCase()}'`: '';// even though we are using string literal we still need to use '' to enclose the variable inside single quotes
    
    let client: PoolClient | null = null;

    try {
        client  = await pool.connect();

        const query = `
            SELECT mp.id as mobility_parking_id, mp.landmark, mp.side, mp.number_of_spaces, mp.width, mp.length, mp.angle, mp.url, l.id AS location_id, l.x, l.y, l.address, l.suburb
            FROM mobility_parking AS mp JOIN location AS l
            ON mp.location_id = l.id
        ` + whereClause + ';';

        
        const result = await client.query(query);

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
        const errorMessage: string = error instanceof Error ? error.message: "Unknown error occured while retrieving mobility parking data";
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
