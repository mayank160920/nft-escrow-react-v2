const clientPromise = require('./mongoClient');

async function fetchBid(req, res) {
    try {
        const client = await clientPromise;
        const database = client.db(process.env.DB_NAME);
        const col = database.collection(process.env.COL_NAME);

        if (req.query.address) {
            const query = {"seller":req.query.address}
            const _data = await col.find({});
            const data = await _data.toArray()
            res.status(200).json({ status : "success", result : data });
        } else {
            const query = {}
            const _data = await col.find(query).limit(20);
            const data = await _data.toArray()
            res.status(200).json({ status : "success", result : data });
        }

    } catch (e) {
        res.status(400).json({ error : e.message });

    }
}

module.exports = fetchBid;