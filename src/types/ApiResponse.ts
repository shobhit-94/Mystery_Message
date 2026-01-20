import { Message } from "../app/model/User.model";
export interface ApiResponse {
  success: boolean;
  message: string;
  text: string;
  isAcceptinhMessages?: boolean;
  messages?: Array<Message>;
}
