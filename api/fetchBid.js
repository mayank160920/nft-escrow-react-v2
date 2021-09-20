const clientPromise = require('./mongoClient');

async function fetchBid(req, res) {
    try {
        const client = await clientPromise;
        const database = client.db(process.env.DB_NAME);
        const col = database.collection(process.env.COL_NAME);

        const data = await col.find().limit(20);
        res.status(200).json({ status : "success", result : data });

    } catch (e) {
        res.status(400).json({ error : e.message });

    }
}

module.exports = fetchBid;