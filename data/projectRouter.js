const express = require('express');
const Projects = require('./helpers/projectModel.js');
const actionRouter = require('./actionRouter.js');
const projectRouter = express.Router();


projectRouter.use('/:project_id/actions', actionRouter);

projectRouter.get('/', (req, res) => {
    Projects
        .get()
        .then(projects => {
            res.status(200).json({projects})
        })
        .catch(() => {
            res.status(500).json({error: "The projects information could not be retrieved."});
    });
});

projectRouter.get('/:project_id', (req, res) => {
    const {project_id} = req.params;

    Projects
        .get(project_id)
        .then(project => {
            if(project){
                res.status(200).json({project})
            } else {
                res.status(404).json({error: "The project with the specified ID does not exist."})
            }
        })
        .catch(() => {
            res.status(500).json({error: "The project information could not be retrieved."});
    });
});

projectRouter.post('/', (req, res) => {
    const project = {name: req.body.name, description: req.body.description, completed: false};

    Projects.insert(project)
        .then(project =>{
            if (project.name === undefined || project.description === undefined) {
                res.status(400).json({error: "Please provide a name for the project."})
            }
            else {
                Projects.get(project.id).then(project =>
                    res.status(201).json({project}))
            }

        })
        .catch(() => {
            res.status(500).json({error: "There was an error while saving the project to the database"})
        })
});

projectRouter.delete('/:project_id', (req, res) => {
    const {project_id} = req.params;

    Projects
        .get(project_id)
        .then(project => {
            if(project){
                Projects.remove(project_id).then(
                res.status(200).json({deleted: true, project}))
            } else {
                res.status(404).json({error: "The project with the specified ID does not exist."})
            }})
        .catch(() => {
            res.status(500).json({error: "The project could not be removed."})
        });
});

projectRouter.put('/:project_id', (req, res) =>{
    const {project_id} = req.params;
    const changes = req.body;

    Projects
        .update(project_id, changes)
        .then(updated => {
            if (!changes.name || !changes.description) {
                res.status(400).json({error: "Please provide a new name for the project."})
            }
            else if(updated) {
                Projects.get(project_id).then(project =>
                    res.status(200).json({project}));
            } else {
                res.status(404).json({error: "The project with the specified ID does not exist."})
            }
        })
        .catch(() => {
            res.status(500).json({error: "The project information could not be modified."});
        });
});

module.exports = projectRouter;