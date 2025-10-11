import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

interface HSNData {
  Original_CTH: string;
  Enhanced_CTH: string;
  Chapter_Code: string;
  Chapter_Description: string;
  Heading_Code: string;
  Heading_Description: string;
  Subheading_Code: string;
  Subheading_Description: string;
  Item_Description: string;
  Complete_Hierarchical_Description: string;
  UQC: string;
  RTA: string;
  Effective_Date: string;
  ITC_CODE: string;
}

interface LookupResult {
  code: string;
  description: string;
  chapter?: string;
  heading?: string;
  subheading?: string;
  item?: string;
  uqc?: string;
  rta?: string;
  effectiveDate?: string;
  itcCode?: string;
}

// Cache for CSV data to avoid reading file on every request
let hsnDataCache: HSNData[] | null = null;

async function loadHSNData(): Promise<HSNData[]> {
  if (hsnDataCache) {
    return hsnDataCache;
  }

  const csvFilePath = path.join(process.cwd(), 'public', 'docs', 'Enhanced_Tariff_Data_20250919_191928.csv');
  const results: HSNData[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data: HSNData) => results.push(data))
      .on('end', () => {
        hsnDataCache = results;
        resolve(results);
      })
      .on('error', reject);
  });
}

function searchHSNCodes(query: string, data: HSNData[]): LookupResult[] {
  const results: LookupResult[] = [];
  const queryLower = query.toLowerCase().trim();

  // Remove non-numeric characters for code matching
  const numericQuery = query.replace(/\D/g, '');

  for (const row of data) {
    let match = false;

    // Check if the query matches any part of the HSN codes
    if (numericQuery.length >= 2) {
      if (
        row.Original_CTH.includes(numericQuery) ||
        row.Enhanced_CTH.includes(numericQuery) ||
        row.Chapter_Code.includes(numericQuery) ||
        row.Heading_Code.includes(numericQuery) ||
        row.Subheading_Code.includes(numericQuery) ||
        row.ITC_CODE.includes(numericQuery)
      ) {
        match = true;
      }
    }

    // Also check description matches
    if (
      row.Chapter_Description.toLowerCase().includes(queryLower) ||
      row.Heading_Description.toLowerCase().includes(queryLower) ||
      row.Subheading_Description.toLowerCase().includes(queryLower) ||
      row.Item_Description.toLowerCase().includes(queryLower)
    ) {
      match = true;
    }

    if (match) {
      results.push({
        code: row.Enhanced_CTH,
        description: row.Item_Description || row.Subheading_Description || row.Heading_Description,
        chapter: row.Chapter_Code + ' - ' + row.Chapter_Description,
        heading: row.Heading_Code + ' - ' + row.Heading_Description,
        subheading: row.Subheading_Code + ' - ' + row.Subheading_Description,
        item: row.Item_Description,
        uqc: row.UQC,
        rta: row.RTA,
        effectiveDate: row.Effective_Date,
        itcCode: row.ITC_CODE
      });
    }
  }

  // Sort results by code length (more specific matches first)
  return results.sort((a, b) => {
    const aLength = a.code.replace(/\D/g, '').length;
    const bLength = b.code.replace(/\D/g, '').length;
    return bLength - aLength;
  }).slice(0, 50); // Limit to 50 results
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        error: 'Query parameter "q" is required and must be at least 2 characters long' 
      }, { status: 400 });
    }

    const hsnData = await loadHSNData();
    const results = searchHSNCodes(query, hsnData);

    return NextResponse.json({
      success: true,
      query,
      results,
      totalResults: results.length,
      source: 'Enhanced Tariff Database'
    });

  } catch (error) {
    console.error('HSN lookup error:', error);
    return NextResponse.json({ 
      error: 'Failed to perform HSN lookup',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
