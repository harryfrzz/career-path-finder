"use client";

import React, { useCallback, useMemo, useEffect } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";

interface CareerPathVisualizationProps {
  skills: string[];
  careerData?: any;
  isLoading?: boolean;
}

const NODE_STYLES = {
  background: "#ffffff",
  border: "2px solid #6366f1",
  borderRadius: "12px",
  padding: "10px 15px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
} as const;

export default function CareerPathVisualization({
  skills,
  careerData,
  isLoading,
}: CareerPathVisualizationProps) {
  // Debug: log the received data
  console.log("CareerPathVisualization received:", {
    skills,
    careerData,
    isLoading,
  });
  console.log("careerData type:", typeof careerData);
  console.log(
    "careerData keys:",
    careerData ? Object.keys(careerData) : "no data",
  );
  console.log("careerRoles:", careerData?.careerRoles);
  console.log("careerRoles type:", typeof careerData?.careerRoles);
  console.log("careerRoles isArray:", Array.isArray(careerData?.careerRoles));

  // Generate nodes and edges based on skills and career data
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Only generate nodes when we have actual Gemini data (not loading and have data)
    if (!isLoading && careerData && !careerData.error) {
      console.log("Generating nodes with careerData:", careerData);

      // Add skill nodes only after we have Gemini response
      skills.forEach((skill, index) => {
        nodes.push({
          id: `skill-${index}`,
          data: { label: skill },
          position: {
            x: 100 + Math.random() * 40, // Add some randomness: 80-120
            y: 100 + index * 120 + Math.random() * 30, // Larger gaps: 120px spacing + randomness
          },
          style: {
            ...NODE_STYLES,
            borderColor: "#4f46e5",
            backgroundColor: "#eef2ff",
          },
        });
      });

      // Add career roles from Gemini data - handle different possible structures
      let roles: string[] = [];
      if (careerData.careerRoles && Array.isArray(careerData.careerRoles)) {
        roles = careerData.careerRoles;
      } else if (careerData.roles && Array.isArray(careerData.roles)) {
        roles = careerData.roles;
      } else if (careerData.jobRoles && Array.isArray(careerData.jobRoles)) {
        roles = careerData.jobRoles;
      } else if (typeof careerData.careerRoles === "string") {
        roles = [careerData.careerRoles];
      }

      console.log("Extracted roles:", roles);

      if (roles.length > 0) {
        roles.forEach((role: string, index: number) => {
          nodes.push({
            id: `role-${index}`,
            data: { label: role },
            position: {
              x: 350 + Math.random() * 80, // Add randomness: 450-510
              y: 200 + index * 130 + Math.random() * 60, // Larger gaps: 130px spacing + randomness
            },
            style: {
              ...NODE_STYLES,
              borderColor: "#10b981",
              backgroundColor: "#ecfdf5",
            },
          });
        });

        // Create a more logical connection pattern
        // Connect skills to roles in a distributed way to avoid mesh network
        skills.forEach((skill, skillIndex) => {
          const roleIndex = skillIndex % roles.length; // Distribute connections
          edges.push({
            id: `edge-skill-${skillIndex}-role-${roleIndex}`,
            source: `skill-${skillIndex}`,
            target: `role-${roleIndex}`,
            style: { stroke: "#94a3b8", strokeWidth: 2 },
          });
        });
      }

      // Add skills to learn - handle different possible structures
      let skillsToLearn: string[] = [];
      if (careerData.skillsToLearn && Array.isArray(careerData.skillsToLearn)) {
        skillsToLearn = careerData.skillsToLearn;
      } else if (
        careerData.recommendedSkills &&
        Array.isArray(careerData.recommendedSkills)
      ) {
        skillsToLearn = careerData.recommendedSkills;
      } else if (careerData.skills && Array.isArray(careerData.skills)) {
        skillsToLearn = careerData.skills;
      } else if (typeof careerData.skillsToLearn === "string") {
        skillsToLearn = [careerData.skillsToLearn];
      }

      console.log("Extracted skillsToLearn:", skillsToLearn);

      if (skillsToLearn.length > 0) {
        skillsToLearn.forEach((skill: string, index: number) => {
          nodes.push({
            id: `learn-${index}`,
            data: { label: `Learn: ${skill}` },
            position: {
              x: 900 + Math.random() * 50, // Add randomness: 820-870
              y: 100 + index * 125 + Math.random() * 35, // Larger gaps: 125px spacing + randomness
            },
            style: {
              ...NODE_STYLES,
              borderColor: "#f59e0b",
              backgroundColor: "#fef3c7",
            },
          });
        });

        // Connect roles to skills-to-learn in a distributed way
        if (roles.length > 0) {
          skillsToLearn.forEach((skill, skillIndex) => {
            const roleIndex = skillIndex % roles.length; // Distribute connections
            edges.push({
              id: `edge-role-${roleIndex}-learn-${skillIndex}`,
              source: `role-${roleIndex}`,
              target: `learn-${skillIndex}`,
              style: {
                stroke: "#f59e0b",
                strokeWidth: 2,
                strokeDasharray: "5,5",
              },
            });
          });
        }
      }

      console.log("Generated nodes:", nodes);
      console.log("Generated edges:", edges);
    }

    return { nodes, edges };
  }, [skills, careerData, isLoading]);

  const [nodesState, setNodes, onNodesChange] = useNodesState([]);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes and edges when they change
  useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds: Edge[]) => addEdge(params, eds));
    },
    [setEdges],
  );

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodesState}
          edges={edgesState}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          fitViewOptions={{
            padding: 0.3,
            includeHiddenNodes: true,
            maxZoom: 0.8,
          }}
          minZoom={0.3}
          maxZoom={1.5}
          defaultViewport={{ x: 50, y: 50, zoom: 0.6 }}
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

      {/* AI Recommendations Panel */}
      <div className="w-80 fixed left-5 top-1/2 transform -translate-y-1/2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-y-auto z-50 max-h-[80vh]">
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
              <span className="ml-2 text-gray-600">
                Analyzing your skills...
              </span>
            </div>
          ) : careerData ? (
            <div className="space-y-6">
              {careerData.error ? (
                <div className="text-red-600 text-sm">{careerData.error}</div>
              ) : (
                <>
                  {careerData.careerRoles &&
                    careerData.careerRoles.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          Recommended Roles
                        </h3>
                        <ul className="space-y-1">
                          {careerData.careerRoles.map(
                            (role: string, index: number) => (
                              <li
                                key={index}
                                className="text-sm text-gray-700 bg-blue-50 px-2 py-1 rounded"
                              >
                                {role}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                  {careerData.skillsToLearn &&
                    careerData.skillsToLearn.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          Skills to Develop
                        </h3>
                        <ul className="space-y-1">
                          {careerData.skillsToLearn.map(
                            (skill: string, index: number) => (
                              <li
                                key={index}
                                className="text-sm text-gray-700 bg-green-50 px-2 py-1 rounded"
                              >
                                {skill}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    )}

                  {careerData.careerPaths &&
                    careerData.careerPaths.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          Career Paths
                        </h3>
                        <div className="space-y-3">
                          {careerData.careerPaths.map(
                            (path: any, index: number) => (
                              <div
                                key={index}
                                className="bg-purple-50 p-3 rounded"
                              >
                                <h4 className="font-medium text-sm">
                                  {path.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  {path.description}
                                </p>
                                {path.steps && (
                                  <ul className="mt-2 space-y-1">
                                    {path.steps.map(
                                      (step: string, stepIndex: number) => (
                                        <li
                                          key={stepIndex}
                                          className="text-xs text-gray-700"
                                        >
                                          {stepIndex + 1}. {step}
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {careerData.industryInsights && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Industry Insights
                      </h3>
                      <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded">
                        {careerData.industryInsights}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Enter your skills to get AI-powered career recommendations
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
