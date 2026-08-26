export function seed(state) {
  state.vendors.push(
    { id: "V-001", name: "Northwind Traders", email: "ap@northwindtraders.com", phone: "+1 555-201-0111", approved: true, createdAt: "2026-05-02T09:00:00" },
    { id: "V-002", name: "Cloudbase Hosting", email: "billing@cloudbase.io", phone: "+1 555-201-0122", approved: true, createdAt: "2026-05-04T09:00:00" },
    { id: "V-003", name: "Staples Direct", email: "orders@staplesdirect.com", phone: "+1 555-201-0133", approved: true, createdAt: "2026-05-10T09:00:00" },
    { id: "V-004", name: "GreenLeaf Catering", email: "events@greenleafcatering.com", phone: "+1 555-201-0144", approved: true, createdAt: "2026-06-01T09:00:00" },
    { id: "V-005", name: "QuickPrint Co", email: "hello@quickprintco.com", phone: "+1 555-201-0155", approved: false, createdAt: "2026-08-14T09:00:00" }
  );

  state.categories.push(
    { id: "C-001", name: "Software & Subscriptions", budget: 500, createdAt: "2026-05-01T09:00:00" },
    { id: "C-002", name: "Office Supplies", budget: 150, createdAt: "2026-05-01T09:00:00" },
    { id: "C-003", name: "Travel", budget: 800, createdAt: "2026-05-01T09:00:00" },
    { id: "C-004", name: "Marketing", budget: 400, createdAt: "2026-05-01T09:00:00" },
    { id: "C-005", name: "Utilities", budget: 300, createdAt: "2026-05-01T09:00:00" },
    { id: "C-006", name: "Meals & Entertainment", budget: 200, createdAt: "2026-05-01T09:00:00" }
  );

  state.expenses.push(
    { id: "EXP-2001", vendorId: "V-002", categoryId: "C-001", amount: 110, date: "2026-06-12", description: "Monthly hosting plan", status: "approved", createdAt: "2026-06-12T09:20:00" },
    { id: "EXP-2002", vendorId: "V-001", categoryId: "C-002", amount: 60, date: "2026-07-08", description: "Printer paper and toner", status: "approved", createdAt: "2026-07-08T11:05:00" },
    { id: "EXP-2003", vendorId: "V-004", categoryId: "C-006", amount: 85, date: "2026-07-22", description: "Team lunch", status: "approved", createdAt: "2026-07-22T13:40:00" },
    { id: "EXP-2004", vendorId: "V-001", categoryId: "C-002", amount: 85, date: "2026-08-03", description: "Desk supplies restock", status: "approved", createdAt: "2026-08-03T10:10:00" },
    { id: "EXP-2005", vendorId: "V-002", categoryId: "C-001", amount: 120, date: "2026-08-07", description: "Cloud storage upgrade", status: "approved", createdAt: "2026-08-07T15:30:00" },
    { id: "EXP-2006", vendorId: "V-004", categoryId: "C-006", amount: 210, date: "2026-08-12", description: "Client dinner", status: "flagged", createdAt: "2026-08-12T19:00:00" },
    { id: "EXP-2007", vendorId: "V-005", categoryId: "C-004", amount: 150, date: "2026-08-15", description: "Flyer printing run", status: "flagged", createdAt: "2026-08-15T09:45:00" },
    { id: "EXP-2008", vendorId: "V-001", categoryId: "C-003", amount: 650, date: "2026-08-20", description: "Client site visit — flights", status: "pending", createdAt: "2026-08-20T08:00:00" },
    { id: "EXP-2009", vendorId: "V-002", categoryId: "C-001", amount: 95, date: "2026-08-24", description: "Team seats add-on", status: "pending", createdAt: "2026-08-24T14:15:00" },
    { id: "EXP-2010", vendorId: "V-003", categoryId: "C-002", amount: 110, date: "2026-08-25", description: "New office chairs", status: "pending", createdAt: "2026-08-25T16:00:00" }
  );

  state.agentLog.push(
    { id: "LOG-9001", expenseId: "EXP-2001", type: "auto-approved", reason: "Cloudbase Hosting is an approved vendor, $110.00 is within the $200.00 auto-approval limit, and Software & Subscriptions had budget room.", timestamp: "2026-06-12T09:20:05" },
    { id: "LOG-9002", expenseId: "EXP-2002", type: "auto-approved", reason: "Northwind Traders is an approved vendor, $60.00 is within the $200.00 auto-approval limit, and Office Supplies had budget room.", timestamp: "2026-07-08T11:05:04" },
    { id: "LOG-9003", expenseId: "EXP-2003", type: "auto-approved", reason: "GreenLeaf Catering is an approved vendor, $85.00 is within the $200.00 auto-approval limit, and Meals & Entertainment had budget room.", timestamp: "2026-07-22T13:40:03" },
    { id: "LOG-9004", expenseId: "EXP-2004", type: "auto-approved", reason: "Northwind Traders is an approved vendor, $85.00 is within the $200.00 auto-approval limit, and Office Supplies had budget room.", timestamp: "2026-08-03T10:10:04" },
    { id: "LOG-9005", expenseId: "EXP-2005", type: "auto-approved", reason: "Cloudbase Hosting is an approved vendor, $120.00 is within the $200.00 auto-approval limit, and Software & Subscriptions had budget room.", timestamp: "2026-08-07T15:30:03" },
    { id: "LOG-9006", expenseId: "EXP-2006", type: "auto-flagged", reason: "This would push Meals & Entertainment to $210.00, over its $200.00 monthly budget for August (already $0.00 spent this month).", timestamp: "2026-08-12T19:00:04" },
    { id: "LOG-9007", expenseId: "EXP-2007", type: "auto-flagged", reason: "QuickPrint Co is not on the approved vendor list, so this expense needs a manual check before it can be approved.", timestamp: "2026-08-15T09:45:03" }
  );

  state.settings = { autoApproveLimit: 200, duplicateWindowDays: 7 };
}
