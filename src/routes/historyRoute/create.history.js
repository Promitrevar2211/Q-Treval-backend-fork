import HistoryModel from "../../models/historyModel";
export async function createHistory(
  userid,
  destinationId,
  query,
  response,
  place,
  city,
  state,
  country
) {
  let history = await HistoryModel.create({
    user_id: userid,
    destinationId,
    query,
    response,
    place,
    city,
    state,
    country,
    created_at : new Date(),
  });

  return history;
}
