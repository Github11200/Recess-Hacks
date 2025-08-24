import { spawn } from "child_process";
import { NextRequest, NextResponse } from "next/server";
import latex from '@igor2017/node-latex'
import os from 'os'
import path from 'path'
import { readFileSync, writeFileSync } from "fs";
import { TimeoutError } from "puppeteer-core";
import { Resume } from "@/lib/interfaces";


export async function POST(request: NextRequest) {
  const resume: Resume = await request.json()

}