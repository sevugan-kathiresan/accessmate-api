import { Request, Response } from "express";
import pool from "../db/connectionPool";
import { PoolClient } from "pg";
import { QueryParams } from "../types";

// Function to get all mobilityparking
export const getAllMobilityParking = (req: Request, res: Response) => {
    
    // Extract the query params
    const { suburb, latitude, longitude, radius } = req.query as QueryParams;
    if (latitude && longitude && radius){
        getNearestParking(latitude, longitude, radius, req, res)
    } else {
        getParking(suburb, req, res)
    }
}

async function getParking(suburb: string | undefined, req: Request, res: Response){
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


async function getNearestParking(latitude: string, longitude: string, radius: string, req: Request, res: Response) {

    let client: PoolClient | null = null;
    const values: number[] = [parseFloat(latitude), parseFloat(longitude), parseFloat(radius)];

    try{
        client = await pool.connect();

        const query: string = `
            SELECT mp.id AS mobility_parking_id, mp.landmark, mp.side, mp.number_of_spaces, mp.width, mp.length, mp.angle, mp.url, l.id AS location_id, l.x, l.y, l.address, l.suburb, ST_Distance(l.geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance
            FROM mobility_parking AS mp JOIN location AS l
            ON mp.location_id = l.id
            WHERE ST_DWithin(l.geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
            ORDER BY distance
            LIMIT 10;
        `;

        const result = await client.query(query, values);

        if (result.rows.length > 0){
            res.status(200).json({
                success: true,
                data: result.rows,
                message: "Mobility Parking data retrieved successfully"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Related Mobiltiy Parking data not found"
            });
        }
    } catch (error) {
        const errorMessage: string = error instanceof Error ? error.message : "Unknown Error ocurred while retireving mobility Parking data";
        console.log(errorMessage);

        res.status(500).json({
            success: false,
            message: "Error retrieving mobility parking data"
        })

    } finally {
        if (client){
            client.release();
        }
    }
}
