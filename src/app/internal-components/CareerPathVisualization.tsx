'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface CareerPathVisualizationProps {
  skills: string[];
}

interface CareerPath {
  domain: string;
  roles: RoleInfo[];
  level?: 'entry' | 'mid' | 'senior';
}

interface RoleInfo {
  name: string;
  requiredSkills: string[];
}

const NODE_STYLES = {
  background: '#ffffff',
  border: '2px solid #6366f1',
  borderRadius: '12px',
  padding: '10px 15px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
} as const;

const EDGE_STYLES = {
  stroke: '#94a3b8',
  strokeWidth: 2,
} as const;

// Updated career paths data with role-specific skills
const CAREER_PATHS: CareerPath[] = [
  {
    domain: 'Software Development',
    roles: [
      { name: 'Frontend Developer', requiredSkills: ['JavaScript', 'TypeScript', 'React', 'HTML', 'CSS'] },
      { name: 'Backend Developer', requiredSkills: ['Node.js', 'Python', 'Java', 'SQL', 'API'] },
      { name: 'Full Stack Developer', requiredSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python'] },
      { name: 'DevOps Engineer', requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'] },
    ],
    level: 'entry'
  },
  {
    domain: 'Data Science',
    roles: [
      { name: 'Data Analyst', requiredSkills: ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics'] },
      { name: 'Data Scientist', requiredSkills: ['Python', 'R', 'Machine Learning', 'Statistics', 'SQL'] },
      { name: 'Machine Learning Engineer', requiredSkills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'AWS'] },
      { name: 'Data Engineer', requiredSkills: ['Python', 'SQL', 'Apache Spark', 'ETL', 'AWS'] },
    ],
    level: 'mid'
  },
  {
    domain: 'Design',
    roles: [
      { name: 'UI/UX Designer', requiredSkills: ['Figma', 'Sketch', 'Adobe XD', 'UI/UX', 'Prototyping'] },
      { name: 'Product Designer', requiredSkills: ['Figma', 'UI/UX', 'Prototyping', 'User Research', 'Design Systems'] },
      { name: 'Graphic Designer', requiredSkills: ['Photoshop', 'Illustrator', 'InDesign', 'Typography', 'Branding'] },
      { name: 'Motion Designer', requiredSkills: ['After Effects', 'Cinema 4D', 'Animation', 'Video Editing', 'Creative Suite'] },
    ],
    level: 'senior'
  },
];

// Helper function to check if a user skill matches a required skill
const skillMatches = (userSkill: string, requiredSkill: string): boolean => {
  const userSkillLower = userSkill.toLowerCase().trim();
  const requiredSkillLower = requiredSkill.toLowerCase().trim();
  
  return userSkillLower.includes(requiredSkillLower) || 
         requiredSkillLower.includes(userSkillLower) ||
         userSkillLower === requiredSkillLower;
};

// Helper function to check if a role is relevant to user skills
const isRoleRelevant = (role: RoleInfo, userSkills: string[]): boolean => {
  return role.requiredSkills.some(requiredSkill =>
    userSkills.some(userSkill => skillMatches(userSkill, requiredSkill))
  );
};

export default function CareerPathVisualization({ skills }: CareerPathVisualizationProps) {
  // Generate nodes and edges based on skills and career paths
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let x = 0;
    let y = 0;
    
    // Add skill nodes
    skills.forEach((skill, index) => {
      nodes.push({
        id: `skill-${index}`,
        data: { label: skill },
        position: { x: x, y: y + index * 100 },
        style: {
          ...NODE_STYLES,
          borderColor: '#4f46e5',
          backgroundColor: '#eef2ff',
        },
      });
    });
    
    // Add domain and role nodes (only for relevant paths)
    let domainY = 0;
    
    // Only proceed if user has entered skills
    if (skills.length === 0) {
      return { nodes, edges };
    }
    
    CAREER_PATHS.forEach((path, pathIndex) => {
      // Filter roles to only include those relevant to user skills (at least 1 matching skill)
      const relevantRoles = path.roles.filter(role => isRoleRelevant(role, skills));
      
      // Only create domain node if there are relevant roles
      if (relevantRoles.length === 0) {
        return; // Skip this domain entirely
      }
      
      const domainNodeId = `domain-${pathIndex}`;
      const xPos = 300;
      
      // Add domain node
      nodes.push({
        id: domainNodeId,
        data: { 
          label: path.domain,
          level: path.level
        },
        position: { x: xPos, y: domainY },
        style: {
          ...NODE_STYLES,
          borderColor: '#7c3aed',
          backgroundColor: '#f5f3ff',
        },
      });
      
      // Connect skills to domain if they match any role's required skills
      skills.forEach((skill, skillIndex) => {
        const hasMatchingRole = relevantRoles.some(role =>
          role.requiredSkills.some(requiredSkill => skillMatches(skill, requiredSkill))
        );
        
        if (hasMatchingRole) {
          edges.push({
            id: `edge-${skillIndex}-${pathIndex}`,
            source: `skill-${skillIndex}`,
            target: domainNodeId,
            ...EDGE_STYLES,
          });
        }
      });
      
      // Add only relevant role nodes
      relevantRoles.forEach((role, roleIndex) => {
        const roleNodeId = `role-${pathIndex}-${roleIndex}`;
        const roleX = xPos + 300;
        const roleY = domainY + (roleIndex * 100);
        
        nodes.push({
          id: roleNodeId,
          data: { 
            label: role.name,
            level: path.level
          },
          position: { x: roleX, y: roleY },
          style: {
            ...NODE_STYLES,
            borderColor: '#10b981',
            backgroundColor: '#ecfdf5',
          },
        });
        
        // Connect domain to role
        edges.push({
          id: `edge-${domainNodeId}-${roleNodeId}`,
          source: domainNodeId,
          target: roleNodeId,
          ...EDGE_STYLES,
        });
      });
      
      domainY += Math.max(relevantRoles.length * 100, 200);
    });
    
    return { nodes, edges };
  }, [skills]);
  
  const [nodesState, , onNodesChange] = useNodesState(nodes);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges);
  
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds: Edge[]) => addEdge(params, eds));
  }, [setEdges]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.2, includeHiddenNodes: true }}
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 20, zoom: 1 }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          gap={16} 
          color="#e2e8f0" 
          size={1} 
          variant={BackgroundVariant.Dots}
        />
        <Controls 
          position="top-right"
          showInteractive={false}
          style={{ top: 10, right: 10 }}
        />
      </ReactFlow>
    </div>
  );
}