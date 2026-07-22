from crewai import Crew, Process
from agents import create_resume_writer, create_ats_reviewer, create_career_coach
from tasks import (
    create_resume_task, create_ats_task, create_improvement_task,
    create_cover_letter_task, create_linkedin_task, create_interview_task
)

class ResumeBuilderCrew:
    def __init__(self, llm):
        self.llm = llm
        # Initialize the agents with the selected LLM
        self.writer = create_resume_writer(self.llm)
        self.reviewer = create_ats_reviewer(self.llm)
        self.coach = create_career_coach(self.llm)

    def run(self, student_profile, job_description, run_bonus=False):
        # Create core tasks
        resume_task = create_resume_task(self.writer)
        ats_task = create_ats_task(self.reviewer, [resume_task])
        improvement_task = create_improvement_task(self.coach, [resume_task, ats_task])

        tasks = [resume_task, ats_task, improvement_task]

        # Bonus tasks (if requested)
        cover_letter_task = None
        linkedin_task = None
        interview_task = None

        if run_bonus:
            cover_letter_task = create_cover_letter_task(self.writer, [resume_task])
            linkedin_task = create_linkedin_task(self.coach, [resume_task])
            interview_task = create_interview_task(self.reviewer, [resume_task])
            tasks.extend([cover_letter_task, linkedin_task, interview_task])

        # Compile and orchestrate the Crew
        crew = Crew(
            agents=[self.writer, self.reviewer, self.coach],
            tasks=tasks,
            process=Process.sequential,
            verbose=True
        )

        # Kickoff the agent workflow
        crew.kickoff(
            inputs={
                "student_profile": student_profile,
                "job_description": job_description
            }
        )

        # Extract output raw text for each task
        resume_output = resume_task.output.raw if resume_task.output else ""
        ats_output = ats_task.output.raw if ats_task.output else ""
        improvement_output = improvement_task.output.raw if improvement_task.output else ""

        response = {
            "resume": resume_output,
            "ats_report": ats_output,
            "improvement_plan": improvement_output
        }

        if run_bonus:
            response["cover_letter"] = cover_letter_task.output.raw if cover_letter_task.output else ""
            response["linkedin_about"] = linkedin_task.output.raw if linkedin_task.output else ""
            response["interview_questions"] = interview_task.output.raw if interview_task.output else ""

        return response
