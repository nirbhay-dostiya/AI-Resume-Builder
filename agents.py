from crewai import Agent

def create_resume_writer(llm):
    return Agent(
        role="Professional Resume Writer & Content Strategist",
        goal="Write an ATS-friendly, highly tailored resume that highlights the student's profile relative to the job description.",
        backstory=(
            "You are an expert in crafting modern resume formats, utilizing strong action verbs, "
            "optimizing professional summaries, and strategically embedding relevant keywords based on "
            "a target job description. You know how to structure content so that both hiring managers "
            "and automated screeners find it compelling."
        ),
        verbose=True,
        allow_delegation=False,
        max_iter=3,
        llm=llm
    )

def create_ats_reviewer(llm):
    return Agent(
        role="ATS Compliance Auditor",
        goal="Evaluate the generated resume against the job description for ATS compliance, scoring, and keyword matching.",
        backstory=(
            "You are an algorithmic system expert that simulates modern ATS screening software. "
            "You analyze keyword density, check for structural formatting issues, highlight gaps, "
            "and compute a score (0 to 100) indicating how well the resume matches the job description."
        ),
        verbose=True,
        allow_delegation=False,
        max_iter=3,
        llm=llm
    )

def create_career_coach(llm):
    return Agent(
        role="Senior Career Coach & Mentor",
        goal="Analyze the differences between the student's profile and the job description to design an actionable career improvement plan.",
        backstory=(
            "You are an experienced career advisor who excels at mapping out professional development. "
            "You analyze skills gaps, suggest target online courses or certifications, and structure a "
            "3-month learning roadmap to help the candidate become the ideal applicant."
        ),
        verbose=True,
        allow_delegation=False,
        max_iter=3,
        llm=llm
    )
