import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";
export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions); //current logged in user chhiye jo seesion me humne store kiya tha option.ts file me
  //to getserversession se current Seesion me se hum current logged in user nikal lenge
  const user = session?.user;

  if (!user || !session.user) {
    return Response.json(
      {
        success: false, //kyuki user mil gya hai to regestration nhi ho sakta hai
        message: "not authenticated |not logged in",
      },
      { status: 401 }
    );
  }
  //kyuki aggregation me dikkat kerga humne option.ts file me session me
  //user._id.toString() me convert kiya tha jo fsinByIdAndUpdate ,findById me to
  //chal zata hai lekin aggration piplines me problem kerga isliye use
  //ObjectId me convert ker lo

  const userId = new mongoose.Types.ObjectId(user._id);

  //for some clarity in aggreation https://www.mongodb.com/docs/manual/aggregation/
  const User = await UserModel.aggregate([
    { $match: { _id: userId } },
    { $unwind: "$messages" }, //Note her mesages ki _id user ki id hi hogi unwind/khune ke baad tabhi hum sort ke baad unhe wapas se collect ker paegnge
    { $sort: { "messages.createdAt": -1 } }, //$sort – sort messages by date
    { $group: { _id: "$_id", messages: { $push: "$messages" } } }, //put messages back into array id me _id dalo or messages me $messages
  ]);
  if (!User || User.length === 0) {
    return Response.json(
      {
        success: false, //kyuki user mil gya hai to regestration nhi ho sakta hai
        message: "User not Found",
      },
      { status: 401 }
    );
  }
  return Response.json(
    {
      success: true, //kyuki user mil gya hai to regestration nhi ho sakta hai
      messages: User[0].messages,
    },
    { status: 200 }
  );
}
/*

Great question 👍
This aggregation looks scary, but once you see it step-by-step, it becomes very logical.
I’ll explain it slowly, in beginner language, exactly in the context of Chai aur Code (Hitesh Sir) style.

🧠 First: what data we are working with

From your User interface:

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  messages: [];
  createdAt: Date;
}

Important part here 👇
messages: []


In MongoDB, this usually looks like:

{
  "_id": ObjectId("abc123"),
  "username": "shobhit",
  "messages": [
    {
      "content": "Hello",
      "createdAt": "2024-01-01"
    },
    {
      "content": "Hi",
      "createdAt": "2024-01-05"
    }
  ]
}


So:

One user

Many messages (array)

🎯 Goal of this aggregation

You want:

✅ Messages of currently logged-in user
✅ Messages sorted by latest first
✅ Return only messages, not full user data

🔑 Why aggregation is needed

Normal query:

UserModel.findById(userId)


❌ Cannot sort inside messages array properly
❌ Cannot reshape data cleanly

Aggregation pipeline = step-by-step data processing

🧩 Step 0: session → userId (IMPORTANT)
const session = await getServerSession(authOptions);
const user = session?.user;


From next-auth, user._id is a string.

Aggregation needs ObjectId, so:

const userId = new mongoose.Types.ObjectId(user._id);


✅ This is correct and important.

🧪 Now the aggregation pipeline (step-by-step)
const User = await UserModel.aggregate([
  { $match: { _id: userId } },
  { $unwind: "$messages" },
  { $sort: { "messages.createdAt": -1 } },
  { $group: { _id: "$_id", messages: { $push: "$messages" } } },
]);


Let’s break each stage 👇

🥇 1️⃣ $match – filter the user
{ $match: { _id: userId } }

Meaning:

“Only keep the document whose _id is this logged-in user’s id”

Before:

Many users in DB

After:
{
  "_id": "abc123",
  "messages": [ ... ]
}


✅ Only one user remains

🥈 2️⃣ $unwind – break messages array
{ $unwind: "$messages" }

Meaning:

“Split the messages array into separate documents”

Before:
{
  "_id": "abc123",
  "messages": [
    { "content": "Hello", "createdAt": "2024-01-01" },
    { "content": "Hi", "createdAt": "2024-01-05" }
  ]
}

After:
{
  "_id": "abc123",
  "messages": { "content": "Hello", "createdAt": "2024-01-01" }
}
{
  "_id": "abc123",
  "messages": { "content": "Hi", "createdAt": "2024-01-05" }
}


✅ Each message becomes its own document

🥉 3️⃣ $sort – sort messages by date
{ $sort: { "messages.createdAt": -1 } }

Meaning:

“Sort messages from newest → oldest”

-1 = descending

1 = ascending

Result order:
Hi (2024-01-05)
Hello (2024-01-01)


✅ Latest messages come first

🏁 4️⃣ $group – put messages back into array
{
  $group: {
    _id: "$_id",
    messages: { $push: "$messages" }
  }
}

Meaning:

“Group everything back by user id and rebuild messages array”

After grouping:
{
  "_id": "abc123",
  "messages": [
    { "content": "Hi", "createdAt": "2024-01-05" },
    { "content": "Hello", "createdAt": "2024-01-01" }
  ]
}


✅ Messages are now:

Sorted

Clean

Inside array again

✅ Final API response
return Response.json({
  success: true,
  messages: User[0].messages
});


So frontend receives:

{
  "success": true,
  "messages": [
    { "content": "Hi", "createdAt": "2024-01-05" },
    { "content": "Hello", "createdAt": "2024-01-01" }
  ]
}

⚠️ Small bug in your code (important)

You wrote:

if (!user || session.user) {

❌ This condition is WRONG

It should be:

if (!user) {


Otherwise it will always fail.

🧠 One-line summary (remember this)

Aggregation = filter → expand → sort → rebuild

Or in your case:

Match the user

Unwind messages

Sort messages

Group messages back

👍 You’re learning the RIGHT way

This is not beginner-level MongoDB.
If you understand this, you are already junior backend ready.

If you want next:

convert this aggregation to TypeScript-safe

optimize it (faster version)

add pagination (infinite scroll)

explain $lookup (joins)

Just tell me 👍
*/
