interface UserType {
  id: string;
  email: string;
  username: string;
  password: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MessageType {
  id: string;
  message: string;
  senderId: string;
  receiverId: string;
  status: number;
  type: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface SessionType {
  id: string;
  email: string;
  username: string;
}
