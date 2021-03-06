import { Router } from "express";
import db from "../models/board.js";

const Board = db.Board;

// board_sync(); // 생성 안할때, 주석

const boardRouter = Router();

let boards = [];

boardRouter.get("/", async(req, res) => {
    const boards = await Board.findAll();
    res.send({
        count: boards.length,
        boards
    });
});

boardRouter.get("/:id", async(req, res) => {
    try{
        const findBoard = await Board.findOne({
            where: {
                id: req.params.id
            }
        });
        if(findBoard) {
            res.status(200).send({
                findBoard
            })
        }else {
            res.status(400).send({msg: '해당 아이디를 가진 board가 없습니다.'});
        }
    }catch(err){
        console.log(err);
        res.status(500).send({msg: "서버에 문제가 발생했습니다."})
    }
});

boardRouter.post("/", async(req, res) => {
    try {
        const { content, title } = req.body;
        if (!title) res.status(400).send({msg: "입력요청이 잘못되었습니다."});

        const result = await User.create({
            title: title ? title : null, 
            content: content ? content : null
        });
        res.status(201).send({
            msg: `id ${result.id}, ${result.title} 게시글이 생성되었습니다.`
        });
    } catch(err) {
        console.log(err);
        res.status(500).send({
            msg: "서비스 이용에 불편을 드려 죄송합니다."
        });
    }
});

boardRouter.put("/:id", async(req, res) => {
    try{
        const { title, content } = req.body;
        
        let board = await Board.findOne({
            where: {
                id: req.params.id
            }
        })


        if(!board || (!title || !content)) {
            res.status(400).send({msg: '게시글이 존재하지 않거나 입력값이 잘못 되었습니다.'});
        }

        if(title) board.name = title;
        if(content)  board.age  = content;

        await board.save();
        res.status(200).send({ msg: '게시글이 정상적으로 수정 되었습니다.' });

    } catch(err) {
        console.log(err);
        res.status(500).send({ msg: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
});

boardRouter.delete("/:id", async(req, res) => {
    try {
        let board = await Board.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!board) {
            res.status(400).send({msg: '게시글이 존재하지 않습니다..'});
        }

        await board.destroy();
        res.status(200).send({ msg: '게시글이 정상적으로 삭제 되었습니다.' });

    } catch(err) {
        console.log(err);
        res.status(500).send({ msg: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
});

export default boardRouter;