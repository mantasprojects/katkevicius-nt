const fs = require('fs');

/* 1. Fix pasiulymai/kurti/[id]/page.tsx */
const createPath = 'c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\pasiulymai\\kurti\\[id]\\page.tsx';
if (fs.existsSync(createPath)) {
    let content = fs.readFileSync(createPath, 'utf8');

    // Add use import from react
    content = content.replace('import { useEffect, useState, useRef } from "react";', 'import { useEffect, useState, useRef, use } from "react";');

    // Change interface
    content = content.replace('interface PropertyParams {\n  params: { id: string };\n}', 'interface PropertyParams {\n  params: Promise<{ id: string }>;\n}');

    // Inside function, before useEffect
    const funcStart = 'export default function CreateProposalPage({ params }: PropertyParams) {';
    const unwrapper = '\n  const unwrappedParams = use(params);\n  const id = unwrappedParams.id;';

    if (content.includes(funcStart)) {
        content = content.replace(funcStart, funcStart + unwrapper);
        // Replace params.id inside with id
        content = content.replace(/params\.id/g, 'id');
    }

    fs.writeFileSync(createPath, content, 'utf8');
    console.log('Updated params unwrapping on create view');
} else {
    console.log('Create view missing');
}

/* 2. Fix pasiulymai/[id]/page.tsx */
const editPath = 'c:\\Users\\manta\\OneDrive\\Desktop\\SVETAINĖ\\svetaine\\src\\app\\admin\\pasiulymai\\[id]\\page.tsx';
if (fs.existsSync(editPath)) {
    let content = fs.readFileSync(editPath, 'utf8');

    // Add use import
    content = content.replace('import { useEffect, useState, useRef } from "react";', 'import { useEffect, useState, useRef, use } from "react";');

    // Change interface if exists matching PageProps
    content = content.replace(/interface PageProps \{\s*params:\s*\{\s*id:\s*string\s*\};\s*\}/, 'interface PageProps {\n  params: Promise<{ id: string }>;\n}');

    // Inside function
    const funcStart = 'export default function EditProposalPage({ params }: PageProps) {';
    const unwrapper = '\n  const unwrappedParams = use(params);\n  const id = unwrappedParams.id;';

    if (content.includes(funcStart)) {
        content = content.replace(funcStart, funcStart + unwrapper);
        // Replace params.id with id
        content = content.replace(/params\.id/g, 'id');
    } else {
        // Look for alternate function name if any
        const funcStartAlt = 'export default function ProposalEditorPage({ params }: PageProps) {';
        if (content.includes(funcStartAlt)) {
            content = content.replace(funcStartAlt, funcStartAlt + unwrapper);
            content = content.replace(/params\.id/g, 'id');
        }
    }

    fs.writeFileSync(editPath, content, 'utf8');
    console.log('Updated params unwrapping on edit view');
} else {
    console.log('Edit view missing');
}
