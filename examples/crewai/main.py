"""CrewAI + Switchy: shared persistent memory across a crew of agents."""

import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew
from switchy_memory import SwitchyMemory

load_dotenv()

# Shared Switchy memory for all agents
memory = SwitchyMemory(namespace="crewai-demo")


def memory_tool_query(query: str) -> str:
    """Query Switchy memory for relevant context."""
    results = memory.query(query, limit=5)
    if not results:
        return "No relevant memories found."
    return "\n".join(f"- [{r['type']}] {r['content']}" for r in results)


def memory_tool_write(content: str) -> str:
    """Save a finding to Switchy memory."""
    mem = memory.write(content, "INSIGHT")
    return f"Saved: {mem['id']}"


# Define agents
researcher = Agent(
    role="Research Analyst",
    goal="Research topics thoroughly and save key findings to shared memory.",
    backstory="You are a meticulous researcher who stores all findings in shared memory for the team.",
    verbose=True,
)

writer = Agent(
    role="Technical Writer",
    goal="Pull research from shared memory and write clear, concise summaries.",
    backstory="You write technical content based on research stored in shared memory by the team.",
    verbose=True,
)

# Define tasks
research_task = Task(
    description=(
        "Research the current state of AI agent frameworks in 2025. "
        "Focus on: LangChain, LlamaIndex, CrewAI, AutoGen, and OpenAI Agents SDK. "
        "Save your key findings using the memory tool."
    ),
    agent=researcher,
    expected_output="A summary of findings about AI agent frameworks.",
)

writing_task = Task(
    description=(
        "Using the research stored in shared memory, write a brief comparison "
        "of the top 3 AI agent frameworks. Include pros, cons, and best use cases."
    ),
    agent=writer,
    expected_output="A concise comparison document of the top 3 frameworks.",
)


def main():
    # Seed some initial context
    memory.write(
        "The team is evaluating AI agent frameworks for a new product feature.",
        "CONTEXT",
    )

    crew = Crew(
        agents=[researcher, writer],
        tasks=[research_task, writing_task],
        verbose=True,
    )

    result = crew.kickoff()
    print("\n" + "=" * 60)
    print("CREW OUTPUT:")
    print("=" * 60)
    print(result)

    # Save final output to memory
    memory.write(str(result), "SUMMARY")
    print("\nFinal output saved to Switchy memory.")


if __name__ == "__main__":
    main()
