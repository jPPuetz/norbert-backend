/**
 * @author Arwed Mett
 */
import { Router } from 'express';
import assert from 'assert';

let router = new Router;

router.post("/", (req, res) => {
    let {title} = req.body;
    let owned_by = req.session.user.id;
    let components, tags;
    try {
        components = JSON.parse(req.body.components);
    } catch(e) {
        components = [];
    }
    try {
        tags = JSON.parse(req.body.tags);
    } catch(e) {
        tags = [];
    }
    let entry = new req.app.core.Entry();

    entry.title = title || "";
    entry.owned_by = owned_by;
    entry.components = components;
    entry.tags = tags;
    req.app.core.createEntry(entry.dbRepresentation).then(entry => {
        res.json({
            message: "Entry successfully created.",
            entry
        })
    })
    .catch(() => {
        res.status(500).send("Could not create entry.")
    })
})


router.put("/:entryId", (req, res) => {
    let entry = {};
    let {title} = req.body;
    if(title) entry.title = title;
    let components, tags;
    try {
        entry.components = JSON.parse(req.body.components);
    } catch(e) {}
    try {
        entry.tags = JSON.parse(req.body.tags);
    } catch(e) {}

    req.app.core.updateEntry(req.params.entryId, entry)
    .then(entry => {
        res.json({
            message: "updated entry",
            entry
        })
    })
    .catch(e => {
        console.error(e);
        res.status(400).send("Could not update entry.")
    })

})

export default router;