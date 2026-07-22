from crewai import Task

def create_resume_task(agent):
    return Task(
        description=(
            "Analyze the candidate's profile:\n{student_profile}\n\n"
            "And the job description:\n{job_description}\n\n"
            "Create a highly tailored, ATS-friendly resume for the candidate. Focus on:\n"
            "1. Highlighting projects and experience that directly align with the job's key responsibilities.\n"
            "2. Integrating relevant keywords from the job description naturally (no keyword stuffing).\n"
            "3. Formatting the output in clean, professional Markdown. Do not include any HTML tags or conversational text. "
            "Start directly with the candidate's name at the top."
        ),
        expected_output="A professionally tailored, ATS-friendly resume in Markdown format.",
        agent=agent
    )

def create_ats_task(agent, context_tasks):
    return Task(
        description=(
            "Review the newly generated resume (from previous tasks) against the job description:\n{job_description}\n\n"
            "Generate a structured ATS compliance audit report. The report must contain:\n"
            "1. **ATS Compatibility Score**: A calculated percentage match (0% to 100%) showing how well the resume aligns with the job requirements.\n"
            "2. **Keyword Analysis**: List of matching keywords found in the resume, and critical missing keywords that should be added.\n"
            "3. **Strengths**: A list of key areas where the candidate meets or exceeds expectations.\n"
            "4. **Weaknesses/Gaps**: Bullet points pointing out formatting, structural, or experience gaps that could cause rejection.\n\n"
            "Format the entire report in clean Markdown."
        ),
        expected_output="A comprehensive ATS compliance report in Markdown format.",
        agent=agent,
        context=context_tasks
    )

def create_improvement_task(agent, context_tasks):
    return Task(
        description=(
            "Review the candidate's profile:\n{student_profile}\n"
            "The job description:\n{job_description}\n"
            "And the ATS report from previous tasks.\n\n"
            "Design a comprehensive, actionable career development plan. The plan must contain:\n"
            "1. **Skills Gap Analysis**: Bullet points of hard and soft skills requested in the job description that the candidate currently lacks.\n"
            "2. **Recommended Courses/Certifications**: Concrete online courses (e.g. from Coursera, Udemy) or industry certifications (e.g. AWS, Meta, Scrum Alliance) that target the missing skills.\n"
            "3. **3-Month Learning Roadmap**: A monthly timeline (Month 1, Month 2, Month 3) outlining weekly steps the candidate should take to acquire the missing skills, build relevant projects, and apply to roles.\n\n"
            "Format the entire plan in clean Markdown."
        ),
        expected_output="An actionable 3-month career development plan and skills roadmap in Markdown format.",
        agent=agent,
        context=context_tasks
    )

def create_cover_letter_task(agent, context_tasks):
    return Task(
        description=(
            "Using the tailored resume generated in the previous tasks and the job description:\n{job_description}\n\n"
            "Write a compelling, professional Cover Letter. Focus on:\n"
            "1. Expressing strong enthusiasm for the role and company.\n"
            "2. Directly connecting the candidate's most relevant projects/internships to the company's requirements.\n"
            "3. Maintaining a professional, confident, yet humble tone.\n\n"
            "Format the cover letter in clean Markdown, ready to copy-paste."
        ),
        expected_output="A professionally written cover letter in Markdown format.",
        agent=agent,
        context=context_tasks
    )

def create_linkedin_task(agent, context_tasks):
    return Task(
        description=(
            "Using the candidate's profile and tailored resume:\n{student_profile}\n\n"
            "Write a highly engaging LinkedIn 'About' (Summary) section. It should:\n"
            "1. Start with a hook (e.g. passion for full-stack engineering, solving complex data problems).\n"
            "2. Highlight key skills, achievements, and core technologies in a clean, readable layout.\n"
            "3. Conclude with a Call to Action (e.g. open to networking, seeking internship/entry-level positions).\n\n"
            "Format the section in clean Markdown, utilizing bullet points or sections where appropriate."
        ),
        expected_output="A professional LinkedIn About/Summary section in Markdown format.",
        agent=agent,
        context=context_tasks
    )

def create_interview_task(agent, context_tasks):
    return Task(
        description=(
            "Based on the tailored resume and the job description:\n{job_description}\n\n"
            "Generate a list of mock interview questions. Produce:\n"
            "1. **5 Technical Questions**: Target core technologies (React, Python, Databases, Git) with detailed sample answers.\n"
            "2. **5 Behavioral Questions**: Based on the STAR method (Situation, Task, Action, Result), targeting communication, teamwork, and conflict resolution, with detailed sample answers.\n\n"
            "Format the questions and answers in clean Markdown."
        ),
        expected_output="A list of 10 mock interview questions and answers in Markdown format.",
        agent=agent,
        context=context_tasks
    )
