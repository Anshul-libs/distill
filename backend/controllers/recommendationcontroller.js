const pool = require("../config/db");
const ai = require("../config/gemini");

const getRecommendations = async (req, res) => {
    try {
        const { profession, task, message } = req.body;

        const userTask = message || task;

        if (!profession || !userTask) {
            return res.status(400).json({
                success: false,
                message: "Profession and task are required"
            });
        }

        // Get active AI tools from Neon
               const searchText = userTask.trim();

const result = await pool.query(
    `
    SELECT
        id,
        tool_name,
        category,
        subcategory,
        target_users,
        description,
        best_use_cases,
        official_website,
        pricing,
        free_plan_details,
        paid_plans,
        ai_models,
        api_available,
        platforms,
        login_required,
        alternatives,
        tags,
        primary_use
    FROM ai_tools
    WHERE is_active = true
      AND (
          tool_name ILIKE $1
          OR category ILIKE $1
          OR subcategory ILIKE $1
          OR description ILIKE $1
          OR best_use_cases ILIKE $1
          OR primary_use ILIKE $1
          OR tags::text ILIKE $1
      )
    ORDER BY
        CASE
            WHEN tool_name ILIKE $1 THEN 1
            WHEN category ILIKE $1 THEN 2
            WHEN subcategory ILIKE $1 THEN 3
            WHEN best_use_cases ILIKE $1 THEN 4
            WHEN primary_use ILIKE $1 THEN 5
            ELSE 6
        END,
        id
    LIMIT 30
    `,
    [`%${searchText}%`]
);

        const tools = result.rows;

        if (!tools.length) {
            return res.status(404).json({
                success: false,
                message: "No active AI tools found in database"
            });
        }

        // Give Gemini the useful database information,
        // not just name/category/description.
        const toolData = tools.map((tool) => ({
            id: tool.id,
            tool_name: tool.tool_name,
            category: tool.category,
            subcategory: tool.subcategory,
            target_users: tool.target_users,
            description: tool.description,
            best_use_cases: tool.best_use_cases,
            pricing: tool.pricing,
            free_plan_details: tool.free_plan_details,
            paid_plans: tool.paid_plans,
            ai_models: tool.ai_models,
            api_available: tool.api_available,
            platforms: tool.platforms,
            login_required: tool.login_required,
            alternatives: tool.alternatives,
            tags: tool.tags,
            primary_use: tool.primary_use
        }));

        const prompt = `
You are the recommendation engine for Distill.

Your job is to recommend the best AI tools from the provided Distill database.

USER PROFESSION:
${profession}

USER TASK:
${userTask}

DATABASE TOOLS:
${JSON.stringify(toolData, null, 2)}

STRICT RULES:

1. Use ONLY tools present in the database.
2. Never invent a tool.
3. Return EXACTLY 7 tools.
4. Rank them from best match to weakest match.
5. The first tool must be the strongest overall match.
6. Match the user's task against:
   - profession
   - category
   - subcategory
   - target users
   - description
   - best use cases
   - pricing
   - primary use
   - tags
7. Do not change the database tool name.
8. Do not invent pricing, features, URLs, models or other factual information.
9. "reason" must explain why the tool matches THIS user's task.
10. "how_it_helps" must explain what the user can actually do with the tool for THIS task.
11. "pros" must contain 2 short strengths supported by the database information.
12. "cons" must contain 2 short limitations based only on information available in the database.
13. Keep every explanation short and useful.
14. Return JSON only.
15. No markdown.
16. No text before or after the JSON.

Return exactly this structure:

{
  "recommendations": [
    {
      "tool_name": "exact database tool_name",
      "reason": "short reason",
      "how_it_helps": "short task-specific explanation",
      "pros": [
        "strength 1",
        "strength 2"
      ],
      "cons": [
        "limitation 1",
        "limitation 2"
      ]
    }
  ]
}
`;

        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash",
            input: prompt
        });

        const aiText = interaction.output_text || "";

        const cleanedText = aiText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        let aiRecommendations;

        try {
            aiRecommendations = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Gemini JSON parse error:", aiText);

            return res.status(500).json({
                success: false,
                message: "Gemini returned invalid recommendation format"
            });
        }

        if (
            !aiRecommendations ||
            !Array.isArray(aiRecommendations.recommendations)
        ) {
            return res.status(500).json({
                success: false,
                message: "Invalid recommendation structure from Gemini"
            });
        }

        // Match Gemini recommendations back to REAL DB 
             const recommendedTools = [];
const usedToolIds = new Set();

for (const recommendation of aiRecommendations.recommendations || []) {
    const tool = tools.find(
        (t) =>
            String(t.tool_name).toLowerCase().trim() ===
            String(recommendation.tool_name).toLowerCase().trim()
    );

    if (!tool) continue;

    // Prevent duplicate tools
    if (usedToolIds.has(tool.id)) continue;

    usedToolIds.add(tool.id);

    recommendedTools.push({
        id: tool.id,
        name: tool.tool_name,
        category: tool.category,
        description: tool.description,
        url: tool.official_website,
        pricing: tool.pricing,

        credits: tool.free_plan_details || "See free plan details",

        pros: Array.isArray(recommendation.pros)
            ? recommendation.pros.slice(0, 2)
            : [],

        cons: Array.isArray(recommendation.cons)
            ? recommendation.cons.slice(0, 2)
            : [],

        recommendation_reason: recommendation.reason || "",

        recommendation_help: recommendation.how_it_helps || "",

        subcategory: tool.subcategory,
        target_users: tool.target_users,
        best_use_cases: tool.best_use_cases,
        free_plan_details: tool.free_plan_details,
        paid_plans: tool.paid_plans,
        ai_models: tool.ai_models,
        api_available: tool.api_available,
        platforms: tool.platforms,
        login_required: tool.login_required,
        alternatives: tool.alternatives,
        tags: tool.tags,
        primary_use: tool.primary_use
    });
}

        // Guarantee that the frontend gets at most 7 cards.
        const finalTools = recommendedTools.slice(0, 7);

        console.log(
            `Gemini selected ${finalTools.length} valid database tools`
        );

        return res.status(200).json({
            success: true,
            profession,
            task: userTask,

            // Clean structured recommendation data
            recommendations: aiRecommendations.recommendations.slice(0, 7),

            // Frontend-ready tool data
            tools: finalTools
        });

    } catch (error) {
        console.error("Recommendation error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate recommendation",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined
        });
    }
};

module.exports = {
    getRecommendations
};