import HistoryModel from "../../models/historyModel";
export async function createHistory(
  userid,
  query,
  response,
  city,
  state,
  country
) {
  let history = await HistoryModel.create({
    user_id: userid,
    query,
    response,
    city,
    state,
    country,
  });

  return history;
}
