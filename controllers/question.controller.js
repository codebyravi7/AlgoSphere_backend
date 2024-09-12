import { Question } from "../models/question.model.js";

export const allquestion = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ message: "ALL questions", questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addquestion = async (req, res) => {
  const { title, link_lt, link_yt, companies, serialNo, category, difficulty } =
    req.body;
  try {
    const newquestion = new Question({
      title,
      link_lt,
      link_yt,
      companies,
      serialNo,
      difficulty,
      category,
    });
    await newquestion.save();
    res
      .status(201)
      .json({ message: "Question added successfully", newquestion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const addRemovequestion = async (req, res) => {
  const { questionId, isChecked } = req.body;
  const user = req.user
  try {
    if (!isChecked) {
      user?.questions?.push(questionId);
    } else {
      user?.questions?.pull(questionId);
    }
    await user.save();

    return res.status(200).json({ message: "Action Done", success: true });
  } catch (err) {
    return res.status(403).json({ message: err, success: false });
  }
};

export const doneUndonequestion = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  try {
    let isDone = user?.questions?.find((questionId) => questionId.equals(id));
    return res.json(isDone);
  } catch (err) {
    return res.json({ message: err, success: false });
  }
};
