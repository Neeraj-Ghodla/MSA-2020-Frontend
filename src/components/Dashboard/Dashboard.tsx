import React from "react";

import { IUser } from "../../service/types";

interface IDashboardProps {
  user: IUser | undefined;
}

export default function Dashboard({ user }: IDashboardProps) {
  // if (user) const { likedMovies, dislikedMovies } = user;
  return <div>{user?.email}</div>;
}
