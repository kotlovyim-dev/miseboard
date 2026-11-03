"use client";

import { createContext } from "react";
import type { Role } from "@miseboard/schema";

export const RoleContext = createContext<Role>("VIEWER");
