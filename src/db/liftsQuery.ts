export const getLiftsQuery = (suburb: string | undefined) : string => {
    const whereClause: string = suburb ? `WHERE LOWER(loc.suburb) = '${suburb.toLowerCase()}'`: ''; // need to include suburb variable inside double quotes

    const query: string = `
        SELECT l.lifts_id, l.name, l.door_width, l.continuous_path, l.location_id, loc.x, loc.y, loc.address, loc.suburb
        FROM lifts AS l JOIN location AS loc
        ON l.location_id = loc.id
    ` + whereClause + ';';

    return query;
}


export const getNearestLiftsQuery = () : string => {
    const query = `
        SELECT l.lifts_id, l.name, l.door_width, l.continuous_path, l.location_id, loc.x, loc.y, loc.address, loc.suburb, ST_Distance(loc.geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance
        FROM lifts AS l JOIN location AS loc
        ON l.location_id = loc.id
        WHERE ST_DWithin(loc.geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
        ORDER BY distance
        LIMIT 10;
    `;

    return query;
}