import axios from "axios";
import { RepositoryItem } from "../interfaces/RepositoryItem";
import { UserInfo } from "../interfaces/UserInfo";
import AuthService from "./AuthService";

const GITHUB_API_URL = import.meta.env.VITE_API_URL;

const githubApi = axios.create({
    baseURL: GITHUB_API_URL,
});

githubApi.interceptors.request.use(
    (config) => {
        const authHeader = AuthService.getAuthHeader();
        if (authHeader) {
            config.headers.Authorization = authHeader;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// GET /user/repos
export const fetchRepositories = async (): Promise<RepositoryItem[]> => {
    try {
        const response = await githubApi.get("/user/repos", {
            params: {
                per_page: 100,
                sort: "created",
                direction: "desc",
                affiliation: "owner",
                t: Date
            },
        });

        return response.data.map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            imageUrl: repo.owner?.avatar_url,
            owner: repo.owner?.login,
            language: repo.language,
        }));
    } catch (error) {
        console.error("Error al obtener repositorios", error);
        return [];
    }
};

// POST + PATCH para garantizar que description se guarde
export const createRepository = async (repo: RepositoryItem) => {
    try {
        // 1️⃣ Crear repo (solo con nombre)
        const response = await githubApi.post("/user/repos", {
            name: repo.name,
            description: repo.description || '',
            private: false
        });

        // 2️⃣ Actualizar descripción si existe
        if (repo.description && repo.description.trim() !== '') {
            const owner = response.data.owner.login;
            const repoName = response.data.name;

            await githubApi.patch(`/repos/${owner}/${repoName}`, {
                description: repo.description
            });
        }

        return response.data;
    } catch (error) {
        console.error("Error al crear repositorio:", error);
        throw error;
    }
};


// PATCH /repos/{owner}/{repo}
export const updateRepository = async (
    owner: string,
    repo: string,
    data: { name?: string; description?: string }
) => {
    await githubApi.patch(`/repos/${owner}/${repo}`, data);
};

// DELETE /repos/{owner}/{repo}
export const deleteRepository = async (owner: string, repo: string) => {
    await githubApi.delete(`/repos/${owner}/${repo}`);
};

// GET /user
export const getUserInfo = async (): Promise<UserInfo> => {
    try {
        const response = await githubApi.get("/user");
        return response.data;
    } catch {
        return {
            login: "undefined",
            name: "Usuario no encontrado",
            bio: "No se pudo obtener la información",
            avatar_url: "",
        };
    }
};
