export const getParkingQuery = (suburb: string | undefined): string => {
    let whereClause: string = suburb? `WHERE LOWER(l.suburb) = '${suburb.toLowerCase()}'`: '';// even though we are using string literal we still need to use '' to enclose the variable inside single quotes

    const query = `
        SELECT mp.id as mobility_parking_id, mp.landmark, mp.side, mp.number_of_spaces, mp.width, mp.length, mp.angle, mp.url, l.id AS location_id, l.x, l.y, l.address, l.suburb
        FROM mobility_parking AS mp JOIN location AS l
        ON mp.location_id = l.id
    ` + whereClause + ';';

    return query;

}


export const getNearestParkingQuery = (): string  => {
    const query: string = `
        SELECT mp.id AS mobility_parking_id, mp.landmark, mp.side, mp.number_of_spaces, mp.width, mp.length, mp.angle, mp.url, l.id AS location_id, l.x, l.y, l.address, l.suburb, ST_Distance(l.geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance
        FROM mobility_parking AS mp JOIN location AS l
        ON mp.location_id = l.id
        WHERE ST_DWithin(l.geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
        ORDER BY distance
        LIMIT 10;
    `;
    return query;
}