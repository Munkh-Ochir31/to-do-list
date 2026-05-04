"use client";

import { createContext } from "react";
import type { Status } from "./types";
import { DEFAULT_STATUSES } from "./constants";

export const StatusContext = createContext<Status[]>(DEFAULT_STATUSES);
