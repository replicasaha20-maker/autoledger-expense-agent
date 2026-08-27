export function seed(state) {
  state.vendors.push(
    { id: "V-001", name: "Northwind Traders", email: "ap@northwindtraders.com", phone: "+1 555-201-0111", approved: true, createdAt: "2026-02-02T09:00:00" },
    { id: "V-002", name: "Cloudbase Hosting", email: "billing@cloudbase.io", phone: "+1 555-201-0122", approved: true, createdAt: "2026-02-04T09:00:00" },
    { id: "V-003", name: "Staples Direct", email: "orders@staplesdirect.com", phone: "+1 555-201-0133", approved: true, createdAt: "2026-02-10T09:00:00" },
    { id: "V-004", name: "GreenLeaf Catering", email: "events@greenleafcatering.com", phone: "+1 555-201-0144", approved: true, createdAt: "2026-03-01T09:00:00" },
    { id: "V-005", name: "QuickPrint Co", email: "hello@quickprintco.com", phone: "+1 555-201-0155", approved: false, createdAt: "2026-08-14T09:00:00" },
    { id: "V-006", name: "Atlas Freight", email: "dispatch@atlasfreight.com", phone: "+1 555-201-0166", approved: true, createdAt: "2026-03-08T09:00:00" },
    { id: "V-007", name: "Bluepeak Software", email: "accounts@bluepeak.dev", phone: "+1 555-201-0177", approved: true, createdAt: "2026-03-12T09:00:00" },
    { id: "V-008", name: "Metro Rideshare", email: "receipts@metroride.com", phone: "+1 555-201-0188", approved: true, createdAt: "2026-04-02T09:00:00" },
    { id: "V-009", name: "Harbor Legal LLP", email: "billing@harborlegal.com", phone: "+1 555-201-0199", approved: false, createdAt: "2026-08-22T09:00:00" }
  );

  state.categories.push(
    { id: "C-001", name: "Software & Subscriptions", budget: 500, createdAt: "2026-02-01T09:00:00" },
    { id: "C-002", name: "Office Supplies", budget: 150, createdAt: "2026-02-01T09:00:00" },
    { id: "C-003", name: "Travel", budget: 800, createdAt: "2026-02-01T09:00:00" },
    { id: "C-004", name: "Marketing", budget: 400, createdAt: "2026-02-01T09:00:00" },
    { id: "C-005", name: "Utilities", budget: 300, createdAt: "2026-02-01T09:00:00" },
    { id: "C-006", name: "Meals & Entertainment", budget: 200, createdAt: "2026-02-01T09:00:00" },
    { id: "C-007", name: "Professional Services", budget: 600, createdAt: "2026-06-01T09:00:00" }
  );

  state.expenses.push(
    // March
    { id: "EXP-2101", vendorId: "V-002", categoryId: "C-001", amount: 108, date: "2026-03-05", description: "Monthly hosting plan", status: "approved", createdAt: "2026-03-05T09:20:00" },
    { id: "EXP-2102", vendorId: "V-001", categoryId: "C-002", amount: 45, date: "2026-03-11", description: "Pens and notepads", status: "approved", createdAt: "2026-03-11T10:15:00" },
    { id: "EXP-2103", vendorId: "V-007", categoryId: "C-001", amount: 89, date: "2026-03-15", description: "Analytics add-on", status: "approved", createdAt: "2026-03-15T14:05:00" },
    { id: "EXP-2104", vendorId: "V-004", categoryId: "C-006", amount: 76, date: "2026-03-21", description: "Team lunch", status: "approved", createdAt: "2026-03-21T13:40:00" },
    { id: "EXP-2105", vendorId: "V-006", categoryId: "C-003", amount: 240, date: "2026-03-24", description: "Courier — client documents", status: "approved", createdAt: "2026-03-24T09:30:00" },
    { id: "EXP-2106", vendorId: "V-005", categoryId: "C-004", amount: 130, date: "2026-03-27", description: "Event poster printing", status: "rejected", createdAt: "2026-03-27T11:00:00" },
    // April
    { id: "EXP-2110", vendorId: "V-002", categoryId: "C-001", amount: 112, date: "2026-04-04", description: "Monthly hosting plan", status: "approved", createdAt: "2026-04-04T09:20:00" },
    { id: "EXP-2111", vendorId: "V-003", categoryId: "C-002", amount: 64, date: "2026-04-09", description: "Whiteboard markers", status: "approved", createdAt: "2026-04-09T10:25:00" },
    { id: "EXP-2112", vendorId: "V-008", categoryId: "C-003", amount: 52, date: "2026-04-14", description: "Airport rides", status: "approved", createdAt: "2026-04-14T18:50:00" },
    { id: "EXP-2113", vendorId: "V-004", categoryId: "C-006", amount: 92, date: "2026-04-18", description: "Client coffee meeting", status: "approved", createdAt: "2026-04-18T09:10:00" },
    { id: "EXP-2114", vendorId: "V-007", categoryId: "C-001", amount: 180, date: "2026-04-23", description: "Seat licenses", status: "approved", createdAt: "2026-04-23T15:30:00" },
    { id: "EXP-2115", vendorId: "V-001", categoryId: "C-002", amount: 210, date: "2026-04-27", description: "Standing desk", status: "flagged", createdAt: "2026-04-27T16:00:00" },
    // May
    { id: "EXP-2120", vendorId: "V-002", categoryId: "C-001", amount: 115, date: "2026-05-06", description: "Monthly hosting plan", status: "approved", createdAt: "2026-05-06T09:20:00" },
    { id: "EXP-2121", vendorId: "V-006", categoryId: "C-003", amount: 300, date: "2026-05-12", description: "Freight — trade show booth", status: "approved", createdAt: "2026-05-12T08:45:00" },
    { id: "EXP-2122", vendorId: "V-004", categoryId: "C-006", amount: 140, date: "2026-05-16", description: "Team dinner", status: "approved", createdAt: "2026-05-16T19:30:00" },
    { id: "EXP-2123", vendorId: "V-003", categoryId: "C-002", amount: 70, date: "2026-05-20", description: "Filing supplies", status: "approved", createdAt: "2026-05-20T10:00:00" },
    { id: "EXP-2124", vendorId: "V-007", categoryId: "C-001", amount: 95, date: "2026-05-24", description: "API tier upgrade", status: "approved", createdAt: "2026-05-24T13:15:00" },
    { id: "EXP-2125", vendorId: "V-008", categoryId: "C-003", amount: 240, date: "2026-05-29", description: "Conference travel rides", status: "approved", createdAt: "2026-05-29T20:10:00" },
    // June
    { id: "EXP-2130", vendorId: "V-002", categoryId: "C-001", amount: 110, date: "2026-06-05", description: "Monthly hosting plan", status: "approved", createdAt: "2026-06-05T09:20:00" },
    { id: "EXP-2131", vendorId: "V-001", categoryId: "C-002", amount: 58, date: "2026-06-10", description: "Printer toner", status: "approved", createdAt: "2026-06-10T10:40:00" },
    { id: "EXP-2132", vendorId: "V-004", categoryId: "C-006", amount: 165, date: "2026-06-15", description: "Client lunch — 6 guests", status: "approved", createdAt: "2026-06-15T13:20:00" },
    { id: "EXP-2133", vendorId: "V-005", categoryId: "C-004", amount: 190, date: "2026-06-19", description: "Brochure run", status: "rejected", createdAt: "2026-06-19T11:30:00" },
    { id: "EXP-2134", vendorId: "V-007", categoryId: "C-001", amount: 260, date: "2026-06-23", description: "Annual security scan tool", status: "flagged", createdAt: "2026-06-23T15:00:00" },
    { id: "EXP-2135", vendorId: "V-006", categoryId: "C-003", amount: 210, date: "2026-06-27", description: "Pallet shipping", status: "approved", createdAt: "2026-06-27T08:30:00" },
    // July
    { id: "EXP-2140", vendorId: "V-002", categoryId: "C-001", amount: 118, date: "2026-07-04", description: "Monthly hosting plan", status: "approved", createdAt: "2026-07-04T09:20:00" },
    { id: "EXP-2141", vendorId: "V-003", categoryId: "C-002", amount: 66, date: "2026-07-09", description: "Desk organizers", status: "approved", createdAt: "2026-07-09T10:15:00" },
    { id: "EXP-2142", vendorId: "V-004", categoryId: "C-006", amount: 105, date: "2026-07-15", description: "Team lunch", status: "approved", createdAt: "2026-07-15T13:35:00" },
    { id: "EXP-2143", vendorId: "V-008", categoryId: "C-005", amount: 130, date: "2026-07-19", description: "Shared office power bill", status: "approved", createdAt: "2026-07-19T09:00:00" },
    { id: "EXP-2144", vendorId: "V-007", categoryId: "C-001", amount: 145, date: "2026-07-24", description: "Extra editor seats", status: "approved", createdAt: "2026-07-24T14:45:00" },
    { id: "EXP-2145", vendorId: "V-001", categoryId: "C-002", amount: 88, date: "2026-07-29", description: "Ergonomic mice (x4)", status: "approved", createdAt: "2026-07-29T11:05:00" },
    { id: "EXP-2146", vendorId: "V-009", categoryId: "C-007", amount: 420, date: "2026-07-31", description: "Contract review — retainer", status: "rejected", createdAt: "2026-07-31T16:20:00" },
    // August (current cycle)
    { id: "EXP-2150", vendorId: "V-002", categoryId: "C-001", amount: 120, date: "2026-08-05", description: "Monthly hosting plan", status: "approved", createdAt: "2026-08-05T09:20:00" },
    { id: "EXP-2151", vendorId: "V-004", categoryId: "C-006", amount: 95, date: "2026-08-09", description: "Team lunch", status: "approved", createdAt: "2026-08-09T13:30:00" },
    { id: "EXP-2152", vendorId: "V-006", categoryId: "C-003", amount: 275, date: "2026-08-13", description: "Rush freight — product samples", status: "approved", createdAt: "2026-08-13T08:15:00" },
    { id: "EXP-2153", vendorId: "V-004", categoryId: "C-006", amount: 210, date: "2026-08-16", description: "Client dinner", status: "flagged", createdAt: "2026-08-16T19:00:00" },
    { id: "EXP-2154", vendorId: "V-005", categoryId: "C-004", amount: 150, date: "2026-08-18", description: "Flyer printing run", status: "flagged", createdAt: "2026-08-18T09:45:00" },
    { id: "EXP-2155", vendorId: "V-001", categoryId: "C-003", amount: 650, date: "2026-08-21", description: "Client site visit — flights", status: "pending", createdAt: "2026-08-21T08:00:00" },
    { id: "EXP-2156", vendorId: "V-002", categoryId: "C-001", amount: 95, date: "2026-08-24", description: "Team seats add-on", status: "pending", createdAt: "2026-08-24T14:15:00" },
    { id: "EXP-2157", vendorId: "V-003", categoryId: "C-002", amount: 110, date: "2026-08-25", description: "New office chairs", status: "pending", createdAt: "2026-08-25T16:00:00" },
    { id: "EXP-2158", vendorId: "V-008", categoryId: "C-005", amount: 140, date: "2026-08-26", description: "Office power bill", status: "pending", createdAt: "2026-08-26T09:30:00" },
    { id: "EXP-2159", vendorId: "V-009", categoryId: "C-007", amount: 380, date: "2026-08-27", description: "Trademark filing assistance", status: "pending", createdAt: "2026-08-27T10:10:00" }
  );

  state.agentLog.push(
    { id: "LOG-9101", expenseId: "EXP-2101", type: "auto-approved", reason: "Cloudbase Hosting is an approved vendor, $108.00 is within the $200.00 auto-approval limit, and Software & Subscriptions had budget room.", timestamp: "2026-03-05T09:20:05" },
    { id: "LOG-9102", expenseId: "EXP-2102", type: "auto-approved", reason: "Northwind Traders is an approved vendor, $45.00 is within the $200.00 auto-approval limit, and Office Supplies had budget room.", timestamp: "2026-03-11T10:15:04" },
    { id: "LOG-9103", expenseId: "EXP-2103", type: "auto-approved", reason: "Bluepeak Software is an approved vendor, $89.00 is within the $200.00 auto-approval limit, and Software & Subscriptions had budget room.", timestamp: "2026-03-15T14:05:03" },
    { id: "LOG-9104", expenseId: "EXP-2104", type: "auto-approved", reason: "GreenLeaf Catering is an approved vendor, $76.00 is within the $200.00 auto-approval limit, and Meals & Entertainment had budget room.", timestamp: "2026-03-21T13:40:04" },
    { id: "LOG-9105", expenseId: "EXP-2105", type: "auto-approved", reason: "Atlas Freight is an approved vendor, $240.00 is within Travel's monthly budget and no duplicates were found in the 7-day window.", timestamp: "2026-03-24T09:30:04" },
    { id: "LOG-9106", expenseId: "EXP-2106", type: "manual-rejected", reason: "Rejected by reviewer — QuickPrint Co is not a vetted vendor and the printing spec did not match the marketing brief.", timestamp: "2026-03-28T09:15:00" },
    { id: "LOG-9114", expenseId: "EXP-2114", type: "auto-approved", reason: "Bluepeak Software is an approved vendor, $180.00 is within the $200.00 auto-approval limit, and Software & Subscriptions had budget room.", timestamp: "2026-04-23T15:30:04" },
    { id: "LOG-9115", expenseId: "EXP-2115", type: "auto-flagged", reason: "This would push Office Supplies to $210.00, over its $150.00 monthly budget for April.", timestamp: "2026-04-27T16:00:04" },
    { id: "LOG-9121", expenseId: "EXP-2121", type: "auto-approved", reason: "Atlas Freight is an approved vendor and $300.00 is within Travel's $800.00 monthly budget.", timestamp: "2026-05-12T08:45:04" },
    { id: "LOG-9122", expenseId: "EXP-2122", type: "auto-approved", reason: "GreenLeaf Catering is an approved vendor, $140.00 is within the $200.00 auto-approval limit, and Meals & Entertainment had budget room.", timestamp: "2026-05-16T19:30:04" },
    { id: "LOG-9125", expenseId: "EXP-2125", type: "auto-approved", reason: "Metro Rideshare is an approved vendor and $240.00 is within Travel's monthly budget.", timestamp: "2026-05-29T20:10:04" },
    { id: "LOG-9130", expenseId: "EXP-2130", type: "auto-approved", reason: "Cloudbase Hosting is an approved vendor, $110.00 is within the $200.00 auto-approval limit, and Software & Subscriptions had budget room.", timestamp: "2026-06-05T09:20:05" },
    { id: "LOG-9132", expenseId: "EXP-2132", type: "auto-approved", reason: "GreenLeaf Catering is an approved vendor, $165.00 is within the $200.00 auto-approval limit, and Meals & Entertainment had budget room.", timestamp: "2026-06-15T13:20:04" },
    { id: "LOG-9133", expenseId: "EXP-2133", type: "manual-rejected", reason: "Rejected by reviewer — QuickPrint Co is unapproved and a cheaper quote was already on file.", timestamp: "2026-06-20T09:05:00" },
    { id: "LOG-9134", expenseId: "EXP-2134", type: "auto-flagged", reason: "Amount $260.00 is above the $200.00 auto-approval limit, so it needs a manual sign-off.", timestamp: "2026-06-23T15:00:04" },
    { id: "LOG-9135", expenseId: "EXP-2135", type: "auto-approved", reason: "Atlas Freight is an approved vendor and $210.00 is within Travel's $800.00 monthly budget.", timestamp: "2026-06-27T08:30:04" },
    { id: "LOG-9140", expenseId: "EXP-2140", type: "auto-approved", reason: "Cloudbase Hosting is an approved vendor, $118.00 is within the $200.00 auto-approval limit, and Software & Subscriptions had budget room.", timestamp: "2026-07-04T09:20:05" },
    { id: "LOG-9142", expenseId: "EXP-2142", type: "auto-approved", reason: "GreenLeaf Catering is an approved vendor, $105.00 is within the $200.00 auto-approval limit, and Meals & Entertainment had budget room.", timestamp: "2026-07-15T13:35:04" },
    { id: "LOG-9143", expenseId: "EXP-2143", type: "auto-approved", reason: "Metro Rideshare is an approved vendor, $130.00 is within the $200.00 auto-approval limit, and Utilities had budget room.", timestamp: "2026-07-19T09:00:04" },
    { id: "LOG-9144", expenseId: "EXP-2144", type: "auto-approved", reason: "Bluepeak Software is an approved vendor, $145.00 is within the $200.00 auto-approval limit, and Software & Subscriptions had budget room.", timestamp: "2026-07-24T14:45:04" },
    { id: "LOG-9145", expenseId: "EXP-2145", type: "auto-approved", reason: "Northwind Traders is an approved vendor, $88.00 is within the $200.00 auto-approval limit, and Office Supplies had budget room.", timestamp: "2026-07-29T11:05:04" },
    { id: "LOG-9146", expenseId: "EXP-2146", type: "manual-rejected", reason: "Rejected by reviewer — Harbor Legal LLP is not on the approved vendor list and the retainer needs a signed SOW first.", timestamp: "2026-08-01T09:40:00" },
    { id: "LOG-9150", expenseId: "EXP-2150", type: "auto-approved", reason: "Cloudbase Hosting is an approved vendor, $120.00 is within the $200.00 auto-approval limit, and Software & Subscriptions had budget room.", timestamp: "2026-08-05T09:20:05" },
    { id: "LOG-9151", expenseId: "EXP-2151", type: "auto-approved", reason: "GreenLeaf Catering is an approved vendor, $95.00 is within the $200.00 auto-approval limit, and Meals & Entertainment had budget room.", timestamp: "2026-08-09T13:30:04" },
    { id: "LOG-9152", expenseId: "EXP-2152", type: "auto-approved", reason: "Atlas Freight is an approved vendor and $275.00 is within Travel's $800.00 monthly budget.", timestamp: "2026-08-13T08:15:04" },
    { id: "LOG-9153", expenseId: "EXP-2153", type: "auto-flagged", reason: "This would push Meals & Entertainment to $305.00, over its $200.00 monthly budget for August.", timestamp: "2026-08-16T19:00:04" },
    { id: "LOG-9154", expenseId: "EXP-2154", type: "auto-flagged", reason: "QuickPrint Co is not on the approved vendor list, so this expense needs a manual check before it can be approved.", timestamp: "2026-08-18T09:45:03" }
  );

  state.settings = { autoApproveLimit: 200, duplicateWindowDays: 7 };
}
