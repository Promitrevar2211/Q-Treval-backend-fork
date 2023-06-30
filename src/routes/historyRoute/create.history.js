import HistoryModel from "../../models/historyModel";
export async function createHistory(
  userid,
  query,
  response,
  location,
  //destinationId,
  // place,
  // city,
  // state,
  // country
) {
  let history = await HistoryModel.create({
    user_id: userid,
    query,
    response,
    location,
    created_at : new Date(),
  });

  return history;
}
