export async function POST(): Promise<Response> {
  return Response.json(
    {
      error: "no-ai",
      note: "Combinatorial copy is the product. Optional Anthropic rewrite is not wired unless ANTHROPIC_API_KEY is set later.",
    },
    { status: 501 },
  );
}
