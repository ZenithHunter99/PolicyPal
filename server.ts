import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Simulating a database in memory
// In a real application, this would be a proper database like PostgreSQL, MongoDB, etc.
let policies = [
    { id: 'POL001', holderName: 'Rohan Sharma', type: 'Health Insurance', premium: 12000, status: 'Active', renewalDate: '2025-10-15' },
    { id: 'POL002', holderName: 'Priya Patel', type: 'Car Insurance', premium: 8000, status: 'Active', renewalDate: '2025-11-20' },
    { id: 'POL003', holderName: 'Amit Singh', type: 'Life Insurance', premium: 25000, status: 'Renewal Due', renewalDate: '2025-09-30' },
    { id: 'POL004', holderName: 'Sneha Reddy', type: 'Home Insurance', premium: 5000, status: 'Lapsed', renewalDate: '2025-07-01' },
    { id: 'POL005', holderName: 'Vikram Gupta', type: 'Health Insurance', premium: 15000, status: 'Active', renewalDate: '2026-01-22' },
    { id: 'POL006', holderName: 'Anjali Mehta', type: 'Car Insurance', premium: 7500, status: 'Renewal Due', renewalDate: '2025-10-05' },
];

let claims = [
    { id: 'CLM001', policyId: 'POL002', holderName: 'Priya Patel', amount: 25000, status: 'Approved', dateFiled: '2025-08-10' },
    { id: 'CLM002', policyId: 'POL001', holderName: 'Rohan Sharma', amount: 50000, status: 'Pending', dateFiled: '2025-09-01' },
    { id: 'CLM003', policyId: 'POL005', holderName: 'Vikram Gupta', amount: 12000, status: 'Rejected', dateFiled: '2025-08-25' },
];

let workflows = [
    { id: 'WF001', name: 'Renewal Reminder', trigger: '30 days before renewal', action: 'Send Email & SMS', enabled: true },
    { id: 'WF002', name: 'Lapsed Policy Follow-up', trigger: '7 days after lapse', action: 'Send Follow-up Email', enabled: true },
    { id: 'WF003', name: 'New Claim Acknowledgement', trigger: 'On new claim submission', action: 'Send Acknowledgement SMS', enabled: false },
];

let insurers = [
    { id: 'INS001', name: 'LIC', connected: true },
    { id: 'INS002', name: 'HDFC Ergo', connected: false },
    { id: 'INS003', name: 'Bajaj Allianz', connected: false },
    { id: 'INS004', name: 'ICICI Lombard', connected: true },
];

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Endpoints

// Dashboard Stats
app.get('/api/dashboard-stats', (req, res) => {
    const totalPolicies = policies.length;
    const activePolicies = policies.filter(p => p.status === 'Active').length;
    const renewalsDue = policies.filter(p => p.status === 'Renewal Due').length;
    const totalClaims = claims.length;
    const pendingClaims = claims.filter(c => c.status === 'Pending').length;
    
    const monthlyPremiums = policies.reduce((acc, p) => {
        const month = new Date(p.renewalDate).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + p.premium;
        return acc;
    }, {});

    const premiumData = Object.keys(monthlyPremiums).map(month => ({ name: month, premium: monthlyPremiums[month] }));

    res.json({
        totalPolicies,
        activePolicies,
        renewalsDue,
        totalClaims,
        pendingClaims,
        premiumData
    });
});

// Policies
app.get('/api/policies', (req, res) => res.json(policies));
app.post('/api/policies', (req, res) => {
    const newPolicy = { id: `POL${String(policies.length + 1).padStart(3, '0')}`, ...req.body };
    policies.push(newPolicy);
    res.status(201).json(newPolicy);
});
app.put('/api/policies/pay/:id', (req, res) => {
    const policy = policies.find(p => p.id === req.params.id);
    if (policy) {
        policy.status = 'Active';
        // Extend renewal date by one year
        const currentDate = new Date(policy.renewalDate);
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        policy.renewalDate = currentDate.toISOString().split('T')[0];
        res.json(policy);
    } else {
        res.status(404).json({ message: 'Policy not found' });
    }
});


// Claims
app.get('/api/claims', (req, res) => res.json(claims));
app.post('/api/claims', (req, res) => {
    const newClaim = { id: `CLM${String(claims.length + 1).padStart(3, '0')}`, ...req.body, dateFiled: new Date().toISOString().split('T')[0] };
    claims.push(newClaim);
    res.status(201).json(newClaim);
});


// Workflows
app.get('/api/workflows', (req, res) => res.json(workflows));
app.post('/api/workflows', (req, res) => {
    const newWorkflow = { id: `WF${String(workflows.length + 1).padStart(3, '0')}`, ...req.body };
    workflows.push(newWorkflow);
    res.status(201).json(newWorkflow);
});
app.put('/api/workflows/:id/toggle', (req, res) => {
    const workflow = workflows.find(w => w.id === req.params.id);
    if (workflow) {
        workflow.enabled = !workflow.enabled;
        res.json(workflow);
    } else {
        res.status(404).json({ message: 'Workflow not found' });
    }
});


// Insurers
app.get('/api/insurers', (req, res) => res.json(insurers));
app.put('/api/insurers/:id/toggle', (req, res) => {
    const insurer = insurers.find(i => i.id === req.params.id);
    if (insurer) {
        insurer.connected = !insurer.connected;
        // Simulate fetching data on connect
        if (insurer.connected) {
             // Add a new mock policy from this insurer
             policies.push({ id: `POL${String(policies.length + 1).padStart(3, '0')}`, holderName: 'Synced Customer', type: 'Synced Policy', premium: 11500, status: 'Active', renewalDate: '2026-03-10' });
        }
        res.json(insurer);
    } else {
        res.status(404).json({ message: 'Insurer not found' });
    }
});

// AI Document Scan Simulation
app.post('/api/ai/scan-document', (req, res) => {
    // In a real app, you'd process the uploaded file with an OCR/AI service.
    // Here, we simulate a 2-second processing time and return mock data.
    setTimeout(() => {
        res.json({
            holderName: 'Priya Singh',
            policyNumber: 'PS-987654321',
            premium: 15000,
            renewalDate: '2026-05-20',
            dob: '1990-05-15',
        });
    }, 2000);
});


// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
