import { Router } from "express";
import _ from "lodash";
import sequelize from "sequelize";
import faker from "faker";
import bcrypt from "bcrypt";
import db from "../models/index.js";



const {User} = db;

const userRouter = Router();


userRouter.get("/", async(req, res) => {
    try {
        let { name, age } = req.query;
        const { Op } = sequelize;
        const findUserQuery = {
            attributes: ['id', 'name', 'age'],
        }
        let result;
        if (name && age) {
            findUserQuery['where'] = { name: {[Op.substring]: name}, age }
        } else if (name) {
            findUserQuery['where'] = { name: {[Op.substring]: name} }
        } else if (age) {
            findUserQuery['where'] = { age }
        }

        result = await User.findAll(findUserQuery);
        res.send({
            count: result.length,
            result
        })
    } catch(err) {
        console.log(err);
        res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
    }
});

userRouter.get("/:id", (req, res) => {
    const findUser = _.find(users, {id: parseInt(req.params.id)});
    let msg;
    if(findUser){
        msg = "정상적으로 조회되었습니다.";
        res.status(200).send({
            msg, findUser
        });
    } else {
        msg = "해당 아이디를 가진 유저가 없습니다.";
        res.status(400).send({
            msg, findUser
        });
    }
    
});

//유저생성
userRouter.post("", async(req, res) => {
    try {
        const { name, age } = req.body;
        if (!name || !age) res.status(400).send({msg: "입력요청이 잘못되었습니다."});

        const result = await User.create({name, age});
        res.status(201).send({
            msg: `id ${result.id}, ${result.name} 유저가 생성되었습니다.`
        });
    } catch(err) {
        console.log(err);
        res.status(500).send({
            msg: "서비스 이용에 불편을 드려 죄송합니다."
        });
    }
    
});

//name 변경
userRouter.put("/:id", async (req, res) => {
    try{
        const { name, age } = req.body;

        let user = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!user || (!name && !age)) {
            res.status(400).send({msg: '유저가 존재하지 않거나 입력값이 잘못 되었습니다.'});
        }

        if(name) user.name = name;
        if(age)  user.age  = age;

        await user.save();

        res.status(200).send({ msg: '유저정보가가 정상적으로 수정 되었습니다.' });

    } catch(err) {
        console.log(err);
        res.status(500).send({ msg: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
});

//user 지우기
userRouter.delete("/:id", async (req, res) => {  // auth(인증)체크 || 권한 체크
    try {

        let user = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        if(!user) {
            res.status(400).send({msg: '유저가 존재하지 않거나 입력값이 잘못 되었습니다.'});
        }

        await user.destroy();
        res.status(200).send({ msg: '유저정보가가 정상적으로 삭제 되었습니다.' });

    } catch(err) {
        console.log(err);
        res.status(500).send({ msg: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    }
});

userRouter.get("/test/:id", async(req, res) => {
    try{
        // findAll
        const Op = sequelize.Op;
        const userResult = await User.findAll({
            attributes: ['id', 'name', 'age', 'updatedAt'],
            where : {
                [Op.or] : [{
                    [Op.and]: {
                        name: { [Op.startsWith] : "김" },
                        age:  { [Op.eq] : 29 }
                    }
                }, {
                    name: { [Op.startsWith] : "하" },
                    age: { [Op.eq] : 29 }
                }]
            },
            order : [['age', 'DESC'], ['name', 'ASC']]
        });
        
        const boardResult = await Board.findAll();

        const user = await User.findOne({
            where: { id: req.params.id }
        });

        if(!user) {
            res.status(400).send({ msg: '해당 유저가 존재하지 않습니다.'});
        }

        await user.destroy();
        board.title += "test 타이틀 입니다.";
        await board.save();

        res.status(200).send({
            user,
            board,
            users: {
                count: userResult.length,
                data: userResult
            },
            boards: {
                count: boardResult.length,
                data: boardResult
            }
        })
    } catch(err) {
        console.log(err)
        res.status(500).send({msg: "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요."})
    }
});

export default userRouter;