export const getStairsQuery = (suburb?: string): string => {
    const whereClause: string = suburb ? `WHERE LOWER(l.suburb) = '${suburb.toLowerCase()}'`: '';

    const query: string = `
        SELECT s.stairs_id, s.no_of_steps, s.hand_rails, s.tgsi, s.stair_nosing_contrast_strip, s.closest_alternate_routes, s.photo, s.location_id, l.x, l.y, l.address, l.suburb
        FROM stairs AS s JOIN location AS l
        on s.location_id = l.id
    ` + whereClause + ';';

    return query;
}

export const getNearestStairsQuery = () : string => {
    const query: string = `
        SELECT s.stairs_id, s.no_of_steps, s.hand_rails, s.tgsi, s.stair_nosing_contrast_strip, s.closest_alternate_routes, s.photo, s.location_id, l.x, l.y, l.address, l.suburb, ST_Distance(l.geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance
        FROM stairs AS s JOIN location AS l
        on s.location_id = l.id
        WHERE ST_DWithin(l.geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
        ORDER BY distance
        LIMIT 10;
    `;

    return query;
}