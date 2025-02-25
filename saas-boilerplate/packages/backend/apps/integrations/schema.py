import graphene
from common.graphql import ratelimit
from .openai import client as openai_client
from .claude import client as claude_client


class GenerateSaasIdeasMutation(graphene.relay.ClientIDMutation):
    class Input:
        keywords = graphene.List(graphene.String)

    ideas = graphene.List(graphene.String)

    @classmethod
    @ratelimit.ratelimit(key="ip", rate='3/min')
    def mutate_and_get_payload(cls, root, info, keywords):
        result = openai_client.OpenAIClient.get_saas_ideas(keywords)
        ideas = [idea for idea in result.choices[0].text.strip().split("\n\n")]
        return cls(ideas=ideas)


class GetCodeCompletionMutation(graphene.relay.ClientIDMutation):
    class Input:
        prompt = graphene.String(required=True)
        context = graphene.String(required=False)
        language = graphene.String(required=False)

    completion = graphene.String()
    model = graphene.String()
    tokens_used = graphene.Int()

    @classmethod
    @ratelimit.ratelimit(key="ip", rate='10/min')
    def mutate_and_get_payload(cls, root, info, prompt, context=None, language=None):
        result = claude_client.ClaudeClient.get_code_completion(prompt, context, language)
        return cls(
            completion=result.content,
            model=result.model,
            tokens_used=result.usage.total_tokens
        )


class Mutation(graphene.ObjectType):
    generate_saas_ideas = GenerateSaasIdeasMutation.Field()
    get_code_completion = GetCodeCompletionMutation.Field()
