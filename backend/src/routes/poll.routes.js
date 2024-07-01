import express from 'express'
const router = express.Router()

import {verifyJWT} from '../middlewares/auth.middleware.js'
import { createPoll, getAllPolls, deletePoll, voteOnPoll } from '../controller/poll.controller.js'

router.route("/create-poll").post(createPoll)
router.route("/get-all-polls").get(getAllPolls)
router.route("/delete-poll/:id").delete(deletePoll)
router.route("/:pollId/options/:optionId/vote").post(verifyJWT, voteOnPoll)


export default router;