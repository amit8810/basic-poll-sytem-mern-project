import { Poll } from "../models/poll.model.js";

const createPoll = async (req, res) => {
    try {
        const {institute, title, description, targetRoles, options } = req.body;

        if(!institute || !title || !description || !targetRoles || !options) {
            return res.status(400).json({
                error: "All fields are required to create a poll"
            })
        }

        const newPoll = new Poll({
            institute,
            title,
            description,
            targetRoles,
            options
        })

        await newPoll.save()

        return res.status(201).json({
            status: 200,
            message: "Poll created successfully",
            poll: newPoll
        })

    } catch (error) {
        console.error('Error while creating poll ', error);
        return res.status(500).json({
            message: "Failed to create the pole",
            error: error
        })
    }
}

const getAllPolls = async (req, res) => {
    try {
        const allPolls = await Poll.find().populate('institute', 'fullName');
        return res.status(200).json({
            message: "All polls are fetched successfully",
            polls:  allPolls
        })
    } catch (error) {
        console.error("Error while fetching all polls ", error);
        return res.status(500).json({
            message: "Error while fetching the polls",
            error: error
        })
    }
}

const deletePoll = async (req, res) => {
    try {
        const pollId = req.params.id;
        await Poll.findByIdAndDelete(pollId);

        return res.status(200).json({
            status: 200,
            message: "Poll deleted successfully"
        })

    } catch (error) {
        console.error("Error while deleting the poll ", error);
        return res.status(500).json({
            message: "Error while deleting the poll",
            error: error
        })
    }
}

const voteOnPoll = async (req, res) => {
    try {
        const {pollId, optionId} = req.params;
        const userId = req.user._id;

        // Find the poll by id
        const poll = await Poll.findById(pollId);
        if(!poll) {
            return res.status(404).json({
                status:404,
                error: "Poll not found"
            })
        }

        // Check if the user is already voted on this poll
        const existingVote = poll.votes.find((vote) => vote.user.toString() === userId.toString());
        if(existingVote) {
            return res.status(400).json({
                status: 400,
                message: "User already voted in this pole"
            })
        }

        // Find the option by ID and increment the vote count
        const option = poll.options.id(optionId);
        if(!option) {
            return res.status(400).json({
                status: 400,
                message: "Option not found"
            })
        }

        option.voteCount += 1;

        // Add user vote to the vote array
        poll.votes.push({user: userId, option: optionId})

        // Save the updated poll
        await poll.save();

        return res.status(200).json({
            status: 200,
            message: "Vote counted successfully",
            poll
        })

    } catch (error) {
        console.error("Error while counted vote ", error);
        return res.status(500).json({
            message: "Failed to vote on poll",
            error: error
        })
    }
}

export { createPoll, getAllPolls, deletePoll, voteOnPoll}
