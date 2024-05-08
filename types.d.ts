interface UserType {
  id: string;
  email: string;
  username: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MessageType {
  id: string;
  message: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SessionType {
  id: string;
  email: string;
  username: string;
}
