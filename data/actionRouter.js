const express = require('express');
const Actions = require('./helpers/actionModel.js');
const Projects = require('./helpers/projectModel.js');

const actionRouter = express.Router({ mergeParams: true });

actionRouter.get('/', (req, res) => {
    const projectsId = req.params.project_id;
    console.log(projectsId);
    Projects
        .getProjectActions(projectsId)
        .then(actions => {
            res.status(200).json({actions})
        })
        .catch(() => {
            res.status(500).json({error: "The actions information could not be retrieved."});
    });
});

actionRouter.get('/:id', (req, res) => {
    const {id} = req.params;

    Actions
        .get(id)
        .then(action => {
            if(action){
                res.status(200).json({action})
            } else {
                res.status(404).json({error: "The action with the specified ID does not exist."})
            }
        })
        .catch(() => {
            res.status(500).json({error: "The action information could not be retrieved."});
    });
});


actionRouter.post('/', (req, res) => {
    const projectId = req.params.project_id
    const desc = req.body.description;
    const notes = req.body.notes;
    const taggedAction = {project_id: projectId, description: desc, notes: notes, completed: false};

    Actions.insert(taggedAction)
        .then(taggedAction =>{
            if (taggedAction.text) {
                Actions.get(taggedAction.id).then(taggedAction =>
                res.status(201).json({taggedAction}))
            }
            else {
                res.status(400).json({error: "Please provide description and notes for the action."})
            }
        }
        )
        .catch(() => {
            res.status(500).json({error: "There was an error while saving the action to the database"})
        })
});

actionRouter.delete('/:id', (req, res) => {
    const {id} = req.params;

    Actions
        .get(id)
        .then(action => {
            if(action){
                Actions.remove(id).then(
                res.status(200).json({deleted: true, action}))
            } else {
                res.status(404).json({error: "The action with the specified ID does not exist."})
            }})
        .catch(() => {
            res.status(500).json({error: "The action could not be removed."})
        });
});

actionRouter.put('/:id', (req, res) =>{
    const {id} = req.params;
    const changes = req.body;

    Actions
        .update(id, changes)
        .then(updated => {
            if (!changes.description || !changes.notes) {
                res.status(400).json({error: "Please provide new description and notes for the action."})
            }
            else if(updated) {
                Actions.getById(id).then(action =>
                    res.status(200).json({action}));
            } else {
                res.status(404).json({error: "The action with the specified ID does not exist."})
            }
        })
        .catch(() => {
            res.status(500).json({error: "The action information could not be modified."});
        });
});



module.exports = actionRouter;